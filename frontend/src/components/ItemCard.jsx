import { useState } from "react";
import Garment from "./Garment";
import Icon from "./Icon";

/**
 * A single clothing item in the wardrobe grid.
 *
 * Removing a piece is destructive, so the card asks for confirmation in
 * place rather than deleting on the first click.
 */
export default function ItemCard({ item, onToggleFavourite, onRemove }) {
  const [confirming, setConfirming] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function confirmRemove() {
    setRemoving(true);
    try {
      await onRemove(item);
    } finally {
      setRemoving(false);
      setConfirming(false);
    }
  }

  return (
    <article className="item">
      <div className="item__media">
        <Garment item={item} />

        {onRemove && !confirming && (
          <button
            className="item__remove"
            onClick={() => setConfirming(true)}
            aria-label={`Remove ${item.name}`}
            title="Remove from wardrobe"
          >
            <Icon name="trash" size={12} />
          </button>
        )}

        <button
          className={`item__fav ${item.is_favourite ? "item__fav--on" : ""}`.trim()}
          onClick={() => onToggleFavourite?.(item)}
          aria-label={item.is_favourite ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={item.is_favourite}
        >
          <Icon name="heart" size={13} fill={item.is_favourite ? "currentColor" : "none"} />
        </button>

        {confirming && (
          <div className="item__confirm">
            <p>Remove this piece from your wardrobe?</p>
            <div className="item__confirm-actions">
              <button className="btn btn--danger" onClick={confirmRemove} disabled={removing}>
                {removing ? "Removing…" : "Remove"}
              </button>
              <button
                className="btn btn--ghost"
                onClick={() => setConfirming(false)}
                disabled={removing}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="item__body">
        <div className="item__name">{item.name}</div>
        <div className="item__brand">{item.brand || item.subcategory}</div>
        <div className="item__meta">
          <span className="chip">{item.category}</span>
          <span className="item__worn">×{item.times_worn}</span>
        </div>
      </div>
    </article>
  );
}
