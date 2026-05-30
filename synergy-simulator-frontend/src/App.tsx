import React, { useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Sparkles } from "lucide-react";

import { CardGrid } from "./components/CardGrid";
import { SynergyPanel } from "./components/SynergyPanel";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  getCardImage,
  getCardOracleText,
  getCardTypeLine,
  type ScryfallCard,
} from "./lib/scryfall";

function getSynergyTags(cards: ScryfallCard[]): string[] {
  const tags = new Set<string>();

  for (const card of cards) {
    const text = getCardOracleText(card).toLowerCase();
    if (text.includes("whenever you gain life")) {
      tags.add("lifegain_payoff");
    }
  }

  return Array.from(tags);
}

type ViewMode = "results" | "hand";

const QUICK_QUERIES: { label: string; query: string }[] = [
  { label: "Green creatures", query: "type:creature color:g" },
  { label: "Lifegain", query: "oracle:'gain life'" },
  { label: "Artifacts", query: "type:artifact" },
  { label: "Enchantments", query: "type:enchantment" },
];

export default function App() {
  const [query, setQuery] = useState(QUICK_QUERIES[0].query);
  const [deckCards, setDeckCards] = useState<ScryfallCard[]>([]);
  const [drawnCards, setDrawnCards] = useState<ScryfallCard[]>([]);
  const [synergyTags, setSynergyTags] = useState<string[]>([]);
  const [selectedCard, setSelectedCard] = useState<ScryfallCard | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("results");

  const [busy, setBusy] = useState<
    "idle" | "loading_deck" | "drawing" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const totalCount = deckCards.length;
  const drawnCount = drawnCards.length;
  const canDraw =
    totalCount >= 7 && busy !== "drawing" && busy !== "loading_deck";

  const displayedCards = viewMode === "hand" ? drawnCards : deckCards;

  const statusLabel = useMemo(() => {
    if (busy === "loading_deck") return "Searching";
    if (busy === "drawing") return "Drawing";
    return "";
  }, [busy]);

  async function fetchDeck() {
    setBusy("loading_deck");
    setErrorMessage("");
    setSynergyTags([]);
    setDrawnCards([]);
    setViewMode("results");

    try {
      const response = await axios.get(
        "https://api.scryfall.com/cards/search",
        {
          params: {
            q: query,
            unique: "cards",
          },
        },
      );

      const cards: ScryfallCard[] = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setDeckCards(cards);
      setBusy("idle");
    } catch (e) {
      setDeckCards([]);
      setBusy("error");
      setErrorMessage(
        e instanceof Error ? e.message : "Failed to fetch deck results",
      );
    }
  }

  async function drawHand() {
    if (!canDraw) {
      return;
    }

    setBusy("drawing");
    setErrorMessage("");

    try {
      const pool = deckCards.slice();
      const drawn: ScryfallCard[] = [];

      for (let i = 0; i < 7; i++) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const [card] = pool.splice(randomIndex, 1);
        if (card) {
          drawn.push(card);
        }
      }

      setDrawnCards(drawn);
      setSynergyTags(getSynergyTags(drawn));
      setViewMode("hand");
      setBusy("idle");
    } catch (e) {
      setBusy("error");
      setErrorMessage(e instanceof Error ? e.message : "Failed to draw hand");
    }
  }

  const modalImage = selectedCard ? getCardImage(selectedCard) : undefined;
  const modalType = selectedCard ? getCardTypeLine(selectedCard) : "";
  const modalOracle = selectedCard ? getCardOracleText(selectedCard) : "";

  const isSynergyCard = useMemo(() => {
    const tags = new Set(synergyTags);

    // Expand as new tags are added.
    return (card: ScryfallCard) => {
      if (!tags.size) return false;

      const text = getCardOracleText(card).toLowerCase();

      if (tags.has("lifegain_payoff")) {
        // broad match: covers variants beyond the exact backend heuristic
        if (text.includes("gain life")) return true;
      }

      return false;
    };
  }, [synergyTags]);

  return (
    <div className="dark min-h-screen">
      {/* background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1100px_700px_at_15%_0%,hsl(var(--primary))/0.22,transparent_60%),radial-gradient(900px_700px_at_85%_10%,hsl(var(--ring))/0.18,transparent_62%),radial-gradient(1000px_800px_at_65%_100%,hsl(0_84%_60%)/0.12,transparent_62%)]"
      />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Synergy Simulator
            </div>
            <h1 className="mt-2 flex items-center gap-2 text-3xl font-semibold tracking-tight">
              <Sparkles className="h-5 w-5 text-primary" />
              Find patterns. Draw hands.
            </h1>
            <p className="mt-2 max-w-[70ch] text-sm text-muted-foreground">
              Paste a Scryfall query, fetch a pool, then draw 7 and scan for
              themes.
            </p>
          </div>

          <div className="grid grid-flow-col gap-3">
            <Card className="w-[120px]">
              <CardHeader className="p-4">
                <CardDescription>Results</CardDescription>
                <div className="text-2xl font-semibold">{totalCount}</div>
              </CardHeader>
            </Card>
            <Card className="w-[120px]">
              <CardHeader className="p-4">
                <CardDescription>Hand</CardDescription>
                <div className="text-2xl font-semibold">{drawnCount}</div>
              </CardHeader>
            </Card>
          </div>
        </header>

        <main className="mt-6 grid gap-4 md:grid-cols-[380px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deck query</CardTitle>
              <CardDescription>
                Use any Scryfall search expression.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      void fetchDeck();
                    }
                  }}
                  placeholder="type:creature color:g"
                  spellCheck={false}
                />

                <Button
                  onClick={() => void fetchDeck()}
                  disabled={busy === "loading_deck"}
                >
                  {busy === "loading_deck" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Fetching
                    </>
                  ) : (
                    "Fetch"
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {QUICK_QUERIES.map((q) => (
                  <Button
                    key={q.label}
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setQuery(q.query);
                      void fetchDeck();
                    }}
                  >
                    {q.label}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => void drawHand()} disabled={!canDraw}>
                  {busy === "drawing" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Drawing
                    </>
                  ) : (
                    "Draw 7"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDeckCards([]);
                    setDrawnCards([]);
                    setSynergyTags([]);
                    setViewMode("results");
                    setBusy("idle");
                    setErrorMessage("");
                  }}
                >
                  Reset
                </Button>
              </div>

              {busy === "error" ? (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3">
                  <div className="text-sm font-semibold">Something broke</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {errorMessage}
                  </div>
                </div>
              ) : null}

              {statusLabel ? (
                <div className="text-xs text-muted-foreground" role="status">
                  {statusLabel}
                </div>
              ) : null}

              <SynergyPanel tags={synergyTags} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Tabs
                  value={viewMode}
                  onValueChange={(v: string) => setViewMode(v as ViewMode)}
                >
                  <TabsList>
                    <TabsTrigger value="results">Results</TabsTrigger>
                    <TabsTrigger value="hand" disabled={!drawnCards.length}>
                      Drawn hand
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="text-xs text-muted-foreground">
                  Click any card to open details.
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <CardGrid
                cards={displayedCards}
                onOpen={(c) => setSelectedCard(c)}
                isHighlighted={viewMode === "hand" ? isSynergyCard : undefined}
                emptyTitle={
                  viewMode === "hand" ? "No hand drawn yet" : "No results yet"
                }
                emptySubtitle={
                  viewMode === "hand"
                    ? "Fetch results, then draw 7."
                    : "Run a query to pull cards from Scryfall."
                }
              />
            </CardContent>
          </Card>
        </main>

        <footer className="mt-4 flex flex-col justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <div>
            Data source:{" "}
            <code className="text-foreground">api.scryfall.com</code>
          </div>
          <div>
            shadcn-style primitives + Tailwind (CRA-compatible build pipeline)
          </div>
        </footer>
      </div>

      <Dialog
        open={!!selectedCard}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedCard(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedCard?.name ?? "Card"}</DialogTitle>
            {modalType ? (
              <DialogDescription>{modalType}</DialogDescription>
            ) : null}
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-[340px_1fr]">
            <div className="overflow-hidden rounded-md border bg-muted">
              {modalImage ? (
                <img
                  src={modalImage}
                  alt={selectedCard?.name ?? "Card"}
                  className="h-auto w-full"
                />
              ) : (
                <div className="p-6 text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-3">
              {modalOracle ? (
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {modalOracle}
                </pre>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No oracle text
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!selectedCard?.name) return;
                    void navigator.clipboard?.writeText(selectedCard.name);
                  }}
                >
                  Copy name
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
