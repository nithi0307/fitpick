import { useEffect, useState } from "react";
import Card from "../components/Card";
import { getClothingItems } from "../services/api";

// My Wardrobe: loads items from the backend and lets the user search
// and filter them. The page only knows about `getClothingItems`, not
// about URLs or HTTP.
export default function Wardrobe() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    getClothingItems()
      .then((data) => {
        setItems(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const visible = items.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="toolbar">
        <input
          type="search"
          placeholder="Search clothing…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {status === "loading" && <p className="message">Loading your wardrobe…</p>}
      {status === "error" && (
        <p className="message">Could not reach the FitPick backend. Is it running?</p>
      )}

      <div className="grid grid--items">
        {visible.map((item) => (
          <Card key={item.id}>
            <div className="item-card__image">{item.category}</div>
            <strong>{item.name}</strong>
            <div className="item-card__meta">
              {item.colour} · <span className="tag">{item.occasion}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
