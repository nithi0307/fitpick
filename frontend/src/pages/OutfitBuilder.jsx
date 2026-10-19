import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import Garment from "../components/Garment";
import Icon from "../components/Icon";
import Topbar from "../components/Topbar";
import { createOutfit, getClothingItems, getOutfits } from "../services/api";

const FILTERS = ["All", "Tops", "Bottoms", "Shoes", "Outerwear"];
const OCCASIONS = ["Casual", "Office", "Date Night", "Weekend", "Formal", "Sport"];
const SLOTS = 4;

/**
 * Outfit Builder.
 *
 * Left column picks pieces, the centre shows the outfit being assembled and
 * the right column captures its name and occasion before saving.
 *
 * `?outfit=<id>` loads a saved outfit into the builder so it can be edited,
 * which is how the Dashboard and Wardrobe link through to an existing look.
 */
export default function OutfitBuilder() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState("Business Casual Friday");
  const [occasion, setOccasion] = useState("Office");
  const [favourite, setFavourite] = useState(true);
  const [message, setMessage] = useState("");
  const [params] = useSearchParams();
  const editing = params.get("outfit");

  useEffect(() => {
    getClothingItems({ sort: "name" }).then(setItems).catch(() => setMessage("API unavailable"));
  }, []);

  useEffect(() => {
    if (!editing) return;
    getOutfits()
      .then((outfits) => outfits.find((outfit) => String(outfit.id) === editing))
      .then((outfit) => {
        if (!outfit) return;
        setName(outfit.name);
        setOccasion(outfit.occasion);
        setFavourite(outfit.is_favourite);
        setSelected(outfit.item_ids.slice(0, SLOTS));
      })
      .catch(() => setMessage("Could not load that outfit"));
  }, [editing]);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
  );

  const chosen = selected
    .map((id) => items.find((item) => item.id === id))
    .filter(Boolean);

  function toggle(item) {
    setSelected((current) =>
      current.includes(item.id)
        ? current.filter((id) => id !== item.id)
        : current.length >= SLOTS
          ? current
          : [...current, item.id]
    );
  }

  async function save() {
    if (!chosen.length) return;
    await createOutfit({ name, occasion, item_ids: selected });
    setMessage(`Saved “${name}”`);
    setSelected([]);
  }

  return (
    <>
      <Topbar title="Outfit Builder" subtitle="Combine pieces into a saved outfit" />

      <div className="builder">
        {/* ---------- pick pieces ---------- */}
        <div className="builder__col">
          <div className="builder__head">
            <div className="filters">
              {FILTERS.map((option) => (
                <button
                  key={option}
                  className={`pill ${filter === option ? "pill--on" : ""}`.trim()}
                  onClick={() => setFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="builder__scroll">
            {visible.length === 0 && (
              <p className="empty">No pieces yet. Add clothing to build an outfit.</p>
            )}
            {visible.map((item) => {
              const on = selected.includes(item.id);
              return (
                <button
                  key={item.id}
                  className="row row--select"
                  aria-pressed={on}
                  onClick={() => toggle(item)}
                  style={{ width: "100%", textAlign: "left" }}
                >
                  <span className="row__thumb">
                    <Garment item={item} />
                  </span>
                  <span>
                    <span className="row__name">{item.name}</span>
                    <br />
                    <span className="row__sub">{item.brand}</span>
                  </span>
                  <span className="row__right">
                    <span className={`check ${on ? "check--on" : ""}`.trim()}>
                      <Icon name="check" size={11} strokeWidth={3} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- the outfit ---------- */}
        <div className="builder__canvas">
          <div className="slots">
            {Array.from({ length: SLOTS }).map((_, index) => {
              const item = chosen[index];
              if (!item) {
                return (
                  <div className="slot slot--empty" key={`empty-${index}`}>
                    <Icon name="plus" size={18} />
                    <span>Add item</span>
                  </div>
                );
              }
              return (
                <div className="slot" key={item.id}>
                  <Garment item={item} />
                  <button
                    className="slot__remove"
                    onClick={() => toggle(item)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Icon name="close" size={11} strokeWidth={2.4} />
                  </button>
                  <div className="slot__label">
                    <div className="slot__name">{item.name}</div>
                    <div className="slot__brand">{item.brand}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- outfit details ---------- */}
        <div className="builder__col">
          <div className="builder__head">
            <input
              className="select"
              style={{ width: "100%", fontWeight: 600 }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-label="Outfit name"
            />
          </div>

          <div className="builder__scroll" style={{ padding: 14, display: "grid", gap: 16 }}>
            <div className="field">
              <span className="field__label">Occasion</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {OCCASIONS.map((option) => (
                  <button
                    key={option}
                    className={`pill ${occasion === option ? "pill--on" : ""}`.trim()}
                    style={{ borderRadius: 8, border: "1px solid var(--line)" }}
                    onClick={() => setOccasion(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <span className="field__label">Selected ({chosen.length} items)</span>
              <div className="rows">
                {chosen.length === 0 && <p className="row__sub">Nothing picked yet.</p>}
                {chosen.map((item) => (
                  <div className="row" key={item.id} style={{ padding: "7px 0" }}>
                    <span className="row__thumb" style={{ width: 26, height: 26 }}>
                      <Garment item={item} />
                    </span>
                    <span className="row__name">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="kv" style={{ cursor: "pointer" }}>
              <span className="kv__k">Favourite outfit</span>
              <input
                type="checkbox"
                checked={favourite}
                onChange={(event) => setFavourite(event.target.checked)}
                style={{ marginLeft: "auto", width: 16, height: 16, accentColor: "var(--blue)" }}
              />
            </label>
          </div>

          <div className="builder__foot">
            {message && <p className="row__sub">{message}</p>}
            <Button block onClick={save} disabled={chosen.length === 0}>
              <Icon name="check" size={14} /> Save Outfit
            </Button>
            <Button variant="ghost" block onClick={() => setSelected([])}>
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
