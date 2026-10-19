import { useEffect, useMemo, useState } from "react";
import Garment from "./Garment";
import Icon from "./Icon";
import { addFromCatalogue, getCatalogue } from "../services/api";

/**
 * The ready-made clothing catalogue.
 *
 * Rather than describing every garment by hand, the user picks the pieces
 * they own and FitPick copies each one into their wardrobe. Browsing changes
 * nothing; only choosing does.
 */

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];

export default function CataloguePicker({ owned = [], onAdded }) {
  const [entries, setEntries] = useState([]);
  const [category, setCategory] = useState("All");
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getCatalogue()
      .then(setEntries)
      .catch(() => setError("Could not load the catalogue."));
  }, []);

  const ownedNames = useMemo(() => new Set(owned.map((item) => item.name)), [owned]);

  const visible = useMemo(
    () => (category === "All" ? entries : entries.filter((e) => e.category === category)),
    [entries, category]
  );

  async function choose(entry) {
    setBusyId(entry.id);
    try {
      const item = await addFromCatalogue(entry.id);
      onAdded?.(item);
    } catch {
      setError("Could not add that piece.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      <div className="filters" style={{ marginBottom: 14 }}>
        {CATEGORIES.map((name) => (
          <button
            key={name}
            className={`pill ${category === name ? "pill--on" : ""}`.trim()}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {error && <p className="empty">{error}</p>}

      <div className="grid grid--items">
        {visible.map((entry) => {
          const alreadyOwned = ownedNames.has(entry.name);
          return (
            <article className="item" key={entry.id}>
              <div className="item__media">
                <Garment item={entry} />
                {alreadyOwned && (
                  <span className="item__owned">
                    <Icon name="check" size={11} strokeWidth={3} /> In wardrobe
                  </span>
                )}
              </div>

              <div className="item__body">
                <div className="item__name">{entry.name}</div>
                <div className="item__brand">{entry.brand}</div>

                <button
                  className={`btn btn--block ${alreadyOwned ? "btn--soft" : "btn--primary"}`}
                  style={{ marginTop: 9, padding: "7px 10px", fontSize: 12 }}
                  onClick={() => choose(entry)}
                  disabled={busyId === entry.id}
                >
                  {busyId === entry.id ? (
                    "Adding…"
                  ) : (
                    <>
                      <Icon name="plus" size={13} />
                      {alreadyOwned ? "Add another" : "Add to wardrobe"}
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
