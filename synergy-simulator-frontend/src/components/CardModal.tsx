import React, { useEffect } from "react";
import {
  getCardImage,
  getCardOracleText,
  getCardTypeLine,
  type ScryfallCard,
} from "../lib/scryfall";

export function CardModal({
  card,
  onClose,
}: {
  card: ScryfallCard | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!card) {
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [card, onClose]);

  if (!card) {
    return null;
  }

  const imageUrl = getCardImage(card);
  const typeLine = getCardTypeLine(card);
  const oracleText = getCardOracleText(card);

  return (
    <div className="ModalOverlay" role="dialog" aria-modal="true">
      <button
        type="button"
        className="ModalOverlay__backdrop"
        onClick={onClose}
        aria-label="Close card details"
      />

      <div className="Modal">
        <div className="Modal__top">
          <div>
            <div className="Modal__title">{card.name}</div>
            {typeLine ? (
              <div className="Modal__subtitle">{typeLine}</div>
            ) : null}
          </div>

          <button type="button" className="IconButton" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="Modal__body">
          <div className="Modal__media">
            {imageUrl ? (
              <img className="Modal__img" src={imageUrl} alt={card.name} />
            ) : (
              <div className="Modal__imgFallback">No image</div>
            )}
          </div>

          <div className="Modal__text">
            {oracleText ? (
              <pre className="Modal__oracle">{oracleText}</pre>
            ) : (
              <div className="Modal__oracleMuted">No oracle text</div>
            )}

            <div className="Modal__actions">
              <button
                type="button"
                className="Button Button--secondary"
                onClick={() => {
                  void navigator.clipboard?.writeText(card.name);
                }}
              >
                Copy name
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
