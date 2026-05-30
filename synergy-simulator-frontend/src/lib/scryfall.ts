export type ScryfallImageUris = {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
  art_crop?: string;
  border_crop?: string;
};

export interface ScryfallCardFace {
  name: string;
  oracle_text?: string;
  type_line?: string;
  mana_cost?: string;
  image_uris?: ScryfallImageUris;
}

export interface ScryfallCard {
  id?: string;
  name: string;
  oracle_text?: string;
  type_line?: string;
  mana_cost?: string;
  colors?: string[];
  image_uris?: ScryfallImageUris;
  card_faces?: ScryfallCardFace[];
}

export function getCardImage(card: ScryfallCard): string | undefined {
  if (card.image_uris?.normal) {
    return card.image_uris.normal;
  }

  const face = card.card_faces?.[0];
  return face?.image_uris?.normal;
}

export function getCardOracleText(card: ScryfallCard): string {
  if (typeof card.oracle_text === "string" && card.oracle_text.trim()) {
    return card.oracle_text;
  }

  if (Array.isArray(card.card_faces) && card.card_faces.length) {
    return card.card_faces
      .map((f) => {
        const header = f.name ? `${f.name}` : "";
        const body = (f.oracle_text ?? "").trim();
        if (!body) {
          return header;
        }
        return `${header}\n${body}`.trim();
      })
      .filter(Boolean)
      .join("\n\n");
  }

  return "";
}

export function getCardTypeLine(card: ScryfallCard): string {
  if (typeof card.type_line === "string" && card.type_line.trim()) {
    return card.type_line;
  }

  const face = card.card_faces?.[0];
  return (face?.type_line ?? "").trim();
}
