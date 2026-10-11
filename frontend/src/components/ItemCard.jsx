import Garment from "./Garment";
import Icon from "./Icon";

/** A single clothing item in the wardrobe grid. */
export default function ItemCard({ item, onToggleFavourite }) {
  return (
    <article className="item">
      <div className="item__media">
        <Garment item={item} />
        <button
          className={`item__fav ${item.is_favourite ? "item__fav--on" : ""}`.trim()}
          onClick={() => onToggleFavourite?.(item)}
          aria-label={item.is_favourite ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={item.is_favourite}
        >
          <Icon name="heart" size={13} fill={item.is_favourite ? "currentColor" : "none"} />
        </button>
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
