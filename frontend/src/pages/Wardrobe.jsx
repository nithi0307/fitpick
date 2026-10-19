import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import ItemCard from "../components/ItemCard";
import Topbar from "../components/Topbar";
import { getClothingItems, toggleClothingFavourite } from "../services/api";

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];
const SEASONS = ["All", "S/S", "F/W", "All Season"];

/**
 * My Wardrobe: search, filter and sort the collection.
 * Filtering happens on the server so the same rules apply to every client.
 */
export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [season, setSeason] = useState("All");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    let cancelled = false;
    getClothingItems({ search, category, season, sort })
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setStatus("ready");
        }
      })
      .catch(() => !cancelled && setStatus("error"));
    return () => {
      cancelled = true;
    };
  }, [search, category, season, sort]);

  const isFiltered = search !== "" || category !== "All" || season !== "All";

  async function handleFavourite(item) {
    const updated = await toggleClothingFavourite(item.id);
    setItems((current) => current.map((i) => (i.id === updated.id ? updated : i)));
  }

  return (
    <>
      <Topbar title="My Wardrobe" subtitle={`${items.length} pieces in your collection`}>
        <Link to="/add-clothing">
          <Button>
            <Icon name="plus" size={14} /> Add Clothing
          </Button>
        </Link>
      </Topbar>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={15} />
          <input
            type="search"
            placeholder="Search your wardrobe…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="filters">
          <Icon name="filter" size={15} color="var(--muted)" />
          {CATEGORIES.map((name) => (
            <button
              key={name}
              className={`pill ${category === name ? "pill--on" : ""}`.trim()}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}

          <span className="filters__divider" />

          {SEASONS.map((name) => (
            <button
              key={name}
              className={`pill ${season === name ? "pill--on" : ""}`.trim()}
              onClick={() => setSeason(name)}
            >
              {name}
            </button>
          ))}
        </div>

        <select
          className="select"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          style={{ marginLeft: "auto" }}
          aria-label="Sort wardrobe"
        >
          <option value="newest">Newest first</option>
          <option value="name">Name A–Z</option>
          <option value="most-worn">Most worn</option>
          <option value="price">Highest price</option>
        </select>
      </div>

      <div className="content">
        {status === "loading" && <p className="spinner-row">Loading your wardrobe…</p>}
        {status === "error" && (
          <p className="spinner-row">Could not reach the FitPick API. Please try again shortly.</p>
        )}
        {status === "ready" && items.length === 0 && (
          isFiltered ? (
            <p className="empty">No pieces match these filters.</p>
          ) : (
            <div className="empty-state">
              <span className="empty-state__icon">
                <Icon name="hanger" size={26} />
              </span>
              <h3>Your wardrobe is empty</h3>
              <p>Add your first piece and it will appear here, sorted into its category.</p>
              <Link to="/add-clothing">
                <Button>
                  <Icon name="plus" size={14} /> Add your first item
                </Button>
              </Link>
            </div>
          )
        )}

        <div className="grid grid--items">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onToggleFavourite={handleFavourite} />
          ))}
        </div>
      </div>
    </>
  );
}
