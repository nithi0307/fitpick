import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Garment from "../components/Garment";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";
import { BarList } from "../components/Charts";
import { getClothingItems, getDashboardStats, getOutfits } from "../services/api";
import { currentUser } from "../services/session";

/** Overview screen: headline figures, recent additions and quick actions. */
export default function Dashboard() {
  const user = currentUser();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [outfits, setOutfits] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getDashboardStats(), getClothingItems({ sort: "newest" }), getOutfits()])
      .then(([dashboard, items, savedOutfits]) => {
        setStats(dashboard);
        setRecent(items.slice(0, 5));
        setOutfits(savedOutfits);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  const [allItems, setAllItems] = useState([]);
  useEffect(() => {
    getClothingItems().then(setAllItems).catch(() => {});
  }, []);

  const itemsById = Object.fromEntries(allItems.map((item) => [item.id, item]));
  const suggestion = outfits.find((outfit) => outfit.is_favourite) ?? outfits[0] ?? null;

  return (
    <>
      <Topbar title="Dashboard" subtitle={`Welcome back, ${user.name.split(" ")[0]}`}>
        <Link to="/add-clothing">
          <Button>
            <Icon name="plus" size={14} /> Add New Clothing
          </Button>
        </Link>
      </Topbar>

      <div className="content">
        {status === "loading" && <p className="spinner-row">Loading your wardrobe…</p>}
        {status === "error" && (
          <p className="spinner-row">Could not reach the FitPick API. Please try again shortly.</p>
        )}

        {stats && (
          <>
            <div className="grid grid--stats" style={{ marginBottom: 14 }}>
              <StatCard
                icon="hanger"
                value={stats.total_items}
                label="Total Clothes"
                note={`+${stats.added_this_week} this week`}
              />
              <StatCard
                icon="layers"
                value={stats.total_outfits}
                label="Outfits Created"
                note="Across all occasions"
              />
              <StatCard
                icon="heart"
                value={stats.favourites}
                label="Favourites"
                note="Pieces you reach for"
              />
              <StatCard
                icon="trend"
                value={stats.most_worn}
                label="Most Worn"
                note={`Worn ${stats.most_worn_count}× total`}
                text
              />
            </div>

            <div className="grid grid--main">
              <div className="stack">
              <Card
                title="Recently Added"
                action={
                  <Link to="/wardrobe" className="card__action">
                    View all <Icon name="chevronRight" size={13} />
                  </Link>
                }
                bodyClass="card__body--tight"
              >
                <div className="rows">
                  {recent.length === 0 && (
                    <p className="empty">Nothing added yet. Your newest pieces will show here.</p>
                  )}
                  {recent.map((item) => (
                    <div className="row" key={item.id}>
                      <span className="row__thumb">
                        <Garment item={item} />
                      </span>
                      <span>
                        <span className="row__name">{item.name}</span>
                        <br />
                        <span className="row__sub">
                          {item.brand} · {item.category}
                        </span>
                      </span>
                      <span className="row__right">
                        <span className="chip chip--grey">{item.season}</span>
                        {item.is_favourite && (
                          <Icon name="heart" size={13} fill="var(--pink)" color="var(--pink)" strokeWidth={0} />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Your Outfits" action={`${outfits.length} saved`} bodyClass="card__body--tight">
                <div className="rows">
                  {outfits.length === 0 && (
                    <p className="empty">No saved outfits yet. Build one from your wardrobe.</p>
                  )}
                  {outfits.map((outfit) => (
                    <Link className="row" key={outfit.id} to={`/outfit-builder?outfit=${outfit.id}`}>
                      <span style={{ display: "flex" }}>
                        {outfit.item_ids.slice(0, 3).map((id, index) =>
                          itemsById[id] ? (
                            <span
                              className="row__thumb"
                              key={id}
                              style={{ marginLeft: index ? -9 : 0, border: "2px solid #fff" }}
                            >
                              <Garment item={itemsById[id]} />
                            </span>
                          ) : null
                        )}
                      </span>
                      <span>
                        <span className="row__name">{outfit.name}</span>
                        <br />
                        <span className="row__sub">
                          {outfit.occasion} · {outfit.item_ids.length} pieces
                        </span>
                      </span>
                      <span className="row__right">
                        {outfit.is_favourite && (
                          <Icon name="heart" size={13} fill="var(--pink)" color="var(--pink)" strokeWidth={0} />
                        )}
                        <Icon name="chevronRight" size={14} color="var(--muted)" />
                      </span>
                    </Link>
                  ))}
                </div>
              </Card>
              </div>

              <div className="stack">
                <Card title="Quick Actions">
                  <div style={{ display: "grid", gap: 8 }}>
                    <Link to="/add-clothing">
                      <Button block between>
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Icon name="plus" size={14} /> Add New Clothing
                        </span>
                        <Icon name="arrowRight" size={14} />
                      </Button>
                    </Link>
                    <Link to="/outfit-builder">
                      <Button variant="dark" block between>
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Icon name="layers" size={14} /> Create Outfit
                        </span>
                        <Icon name="arrowRight" size={14} />
                      </Button>
                    </Link>
                    <Link to="/wardrobe">
                      <Button variant="ghost" block between>
                        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <Icon name="shuffle" size={14} /> Browse Wardrobe
                        </span>
                        <Icon name="arrowRight" size={14} />
                      </Button>
                    </Link>
                  </div>
                </Card>

                <Card title="Wardrobe Breakdown">
                  {stats.breakdown.length === 0 ? (
                    <p className="empty">Add clothing to see it broken down by category.</p>
                  ) : (
                    <BarList data={stats.breakdown} />
                  )}
                </Card>

                {suggestion && (
                  <div className="banner">
                    <div className="banner__eyebrow">
                      <Icon name="star" size={12} fill="currentColor" strokeWidth={0} />
                      Saved Outfit
                    </div>
                    <div className="banner__title">{suggestion.name}</div>
                    <div className="banner__text">
                      {suggestion.occasion} · {suggestion.item_ids.length} pieces
                      {suggestion.item_ids
                        .map((id) => itemsById[id]?.name)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((name) => ` · ${name}`)}
                    </div>
                    <Link to={`/outfit-builder?outfit=${suggestion.id}`} className="banner__link">
                      Open in builder <Icon name="chevronRight" size={12} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
