import React from "react";
import {
  getCardImage,
  getCardOracleText,
  getCardTypeLine,
  type ScryfallCard,
} from "../lib/scryfall";
import { Card, CardContent } from "./ui/card";

export function CardTile({
  card,
  onOpen,
  highlighted,
}: {
  card: ScryfallCard;
  onOpen: (card: ScryfallCard) => void;
  highlighted: boolean;
}) {
  const imageUrl = getCardImage(card);
  const oracleText = getCardOracleText(card);
  const typeLine = getCardTypeLine(card);

  return (
    <button
      type="button"
      onClick={() => onOpen(card)}
      className="block w-full text-left"
      aria-label={`Open card details: ${card.name}`}
    >
      <Card
        className={
          "overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg " +
          (highlighted
            ? "ring-2 ring-primary/70 shadow-[0_0_0_1px_rgba(124,92,255,0.25)]"
            : "")
        }
      >
        <div className="relative aspect-[63/44] w-full bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={card.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-muted to-muted/40 px-3 text-center"
              role="img"
              aria-label={`No image available for ${card.name}`}
            >
              <div className="text-sm font-semibold text-foreground/80">
                No image
              </div>
              <div className="text-xs text-muted-foreground">
                Scryfall artwork unavailable
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

          {highlighted ? (
            <div className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-primary-foreground shadow-sm">
              Synergy
            </div>
          ) : null}
        </div>

        <CardContent className="p-4">
          <div className="line-clamp-2 text-sm font-semibold">{card.name}</div>
          {typeLine ? (
            <div className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {typeLine}
            </div>
          ) : null}
          {oracleText ? (
            <div className="mt-2 line-clamp-4 text-xs text-muted-foreground">
              {oracleText}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </button>
  );
}
