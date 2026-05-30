// api.ts
import axios from "axios";

export interface Card {
  name: string;
  oracle_text?: string;
}

export async function getDeck(query: {
  query?: string;
}): Promise<{ cards: Card[] }> {
  const q = typeof query.query === "string" ? query.query.trim() : "";
  if (!q) {
    return { cards: [] };
  }

  // Scryfall search API; we normalize to { cards } so the frontend stays simple.
  const url = "https://api.scryfall.com/cards/search";
  const params = {
    q,
    unique: "cards",
  };

  try {
    const response = await axios.get(url, { params });
    const cards = Array.isArray(response.data?.data) ? response.data.data : [];
    return { cards };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to fetch deck: ${msg}`);
  }
}

export async function drawCards(input: { cards: Card[] }): Promise<{
  drawn_cards: Card[];
  synergy_tags: string[];
}> {
  const cards = Array.isArray(input.cards) ? input.cards.slice() : [];
  if (cards.length < 7) {
    throw new Error("Deck must contain at least 7 cards");
  }

  const drawnCards: Card[] = [];
  for (let i = 0; i < 7; i++) {
    const randomIndex = Math.floor(Math.random() * cards.length);
    const [card] = cards.splice(randomIndex, 1);
    if (card) {
      drawnCards.push(card);
    }
  }

  return {
    drawn_cards: drawnCards,
    synergy_tags: getSynergyTags(drawnCards),
  };
}

function getSynergyTags(cards: Card[]): string[] {
  const synergyTags = new Set<string>();

  for (const card of cards) {
    const text = card.oracle_text?.toLowerCase() ?? "";

    if (text.includes("whenever you gain life")) {
      synergyTags.add("lifegain_payoff");
    }

    // Add more conditions as needed
  }

  return Array.from(synergyTags);
}
