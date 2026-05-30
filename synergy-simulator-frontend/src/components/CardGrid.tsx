import React from "react";
import { type ScryfallCard } from "../lib/scryfall";
import { CardTile } from "./CardTile";

export function CardGrid({
  cards,
  onOpen,
  emptyTitle,
  emptySubtitle,
  isHighlighted,
}: {
  cards: ScryfallCard[];
  onOpen: (card: ScryfallCard) => void;
  emptyTitle: string;
  emptySubtitle: string;
  isHighlighted?: (card: ScryfallCard) => boolean;
}) {
  if (!cards.length) {
    return (
      <div className="rounded-lg border border-dashed p-10 text-center">
        <div className="text-lg font-semibold">{emptyTitle}</div>
        <div className="mt-2 text-sm text-muted-foreground">
          {emptySubtitle}
        </div>
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      role="list"
      aria-label="Cards"
    >
      {cards.map((card, idx) => (
        <div key={card.id ?? `${card.name}-${idx}`} role="listitem">
          <CardTile
            card={card}
            onOpen={onOpen}
            highlighted={isHighlighted?.(card) ?? false}
          />
        </div>
      ))}
    </div>
  );
}
