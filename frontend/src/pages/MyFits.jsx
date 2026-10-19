import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Garment from "../components/Garment";
import Icon from "../components/Icon";
import Topbar from "../components/Topbar";
import {
  deleteOutfit,
  getClothingItems,
  getOutfits,
  toggleOutfitFavourite,
} from "../services/api";

/**
 * Every saved outfit, numbered Fit 1, Fit 2, … with its style score.
 *
 * The score comes from the backend's rule-based style service, so the same
 * pieces always produce the same number and each point can be explained.
 */

function band(score) {
  if (score >= 8) return "good";
  if (score >= 5) return "ok";
  return "poor";
}

export default function MyFits() {
  const [outfits, setOutfits] = useState([]);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getOutfits(), getClothingItems()])
      .then(([saved, wardrobe]) => {
        setOutfits(saved);
        setItems(wardrobe);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const byId = Object.fromEntries(items.map((item) => [item.id, item]));

  async function favourite(outfit) {
    const updated = await toggleOutfitFavourite(outfit.id);
    setOutfits((current) => current.map((o) => (o.id === updated.id ? updated : o)));
  }

  async function remove(outfit) {
    await deleteOutfit(outfit.id);
    setOutfits((current) => current.filter((o) => o.id !== outfit.id));
  }

  return (
    <>
      <Topbar title="My Fits" subtitle={`${outfits.length} saved outfits`}>
        <Link to="/outfit-builder">
          <Button>
            <Icon name="plus" size={14} /> Build a fit
          </Button>
        </Link>
      </Topbar>

      <div className="content">
        {status === "loading" && <p className="spinner-row">Loading your fits…</p>}
        {status === "error" && (
          <p className="spinner-row">Could not reach the FitPick API. Please try again shortly.</p>
        )}

        {status === "ready" && outfits.length === 0 && (
          <div className="empty-state">
            <span className="empty-state__icon">
              <Icon name="layers" size={26} />
            </span>
            <h3>No fits yet</h3>
            <p>Combine pieces from your wardrobe and save them — each one is scored out of ten.</p>
            <Link to="/outfit-builder">
              <Button>
                <Icon name="plus" size={14} /> Build your first fit
              </Button>
            </Link>
          </div>
        )}

        <div className="grid grid--two">
          {outfits.map((outfit, index) => (
            <article className="fit" key={outfit.id}>
              <header className="fit__head">
                <div>
                  <div className="fit__label">Fit {index + 1}</div>
                  <h3 className="fit__name">{outfit.name}</h3>
                  <span className="chip">{outfit.occasion}</span>
                </div>

                <div className={`fit__score fit__score--${band(outfit.score)}`}>
                  <span className="fit__score-value">{outfit.score}</span>
                  <span className="fit__score-max">/10</span>
                </div>
              </header>

              <div className="fit__pieces">
                {outfit.item_ids.map((id) =>
                  byId[id] ? (
                    <span className="fit__piece" key={id} title={byId[id].name}>
                      <Garment item={byId[id]} />
                    </span>
                  ) : null
                )}
              </div>

              <ul className="fit__notes">
                {outfit.score_notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>

              <footer className="fit__actions">
                <button
                  className={`iconbtn ${outfit.is_favourite ? "iconbtn--on" : ""}`.trim()}
                  onClick={() => favourite(outfit)}
                  aria-label={outfit.is_favourite ? "Remove from favourites" : "Add to favourites"}
                >
                  <Icon
                    name="heart"
                    size={15}
                    fill={outfit.is_favourite ? "currentColor" : "none"}
                  />
                </button>

                <Link to={`/outfit-builder?outfit=${outfit.id}`}>
                  <Button variant="ghost">Open in builder</Button>
                </Link>

                <button
                  className="iconbtn iconbtn--danger"
                  onClick={() => remove(outfit)}
                  aria-label={`Delete ${outfit.name}`}
                >
                  <Icon name="trash" size={15} />
                </button>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
