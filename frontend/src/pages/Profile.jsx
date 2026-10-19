import { useEffect, useState } from "react";
import Card from "../components/Card";
import Icon from "../components/Icon";
import StatCard from "../components/StatCard";
import Topbar from "../components/Topbar";
import { BarList, DonutChart } from "../components/Charts";
import { SWATCHES } from "../components/swatches";
import { getAnalytics, getClothingItems, getDashboardStats } from "../services/api";

/** Profile & Analytics: account details beside wardrobe insight. */
export default function Profile() {
  const [analytics, setAnalytics] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [lastAdded, setLastAdded] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    Promise.all([getAnalytics(), getDashboardStats(), getClothingItems({ sort: "newest" })])
      .then(([a, d, items]) => {
        setAnalytics(a);
        setDashboard(d);
        setLastAdded(items[0] ?? null);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <>
      <Topbar title="Profile & Analytics" subtitle="Your account and wardrobe insight" />

      <div className="content">
        {status === "loading" && <p className="spinner-row">Loading…</p>}
        {status === "error" && (
          <p className="spinner-row">Could not reach the FitPick API. Please try again shortly.</p>
        )}

        {analytics && dashboard && (
          <div className="grid" style={{ gridTemplateColumns: "280px minmax(0, 1fr)" }}>
            {/* ---------- left column ---------- */}
            <div className="stack">
              <section className="card">
                <div className="profile-cover" />
                <div className="profile-body">
                  <span className="avatar avatar--lg" style={{ border: "3px solid #fff" }}>JA</span>
                  <h3 style={{ fontSize: 15, marginTop: 6 }}>Jamie Anderson</h3>
                  <div className="row__sub">jamie@email.com</div>
                  <span className="chip chip--amber" style={{ marginTop: 6 }}>
                    <Icon name="star" size={10} fill="currentColor" strokeWidth={0} /> Premium Member
                  </span>

                  <div className="profile-stats">
                    <div className="profile-stat">
                      <b>{dashboard.total_items}</b>
                      <span>Items</span>
                    </div>
                    <div className="profile-stat">
                      <b>{dashboard.total_outfits}</b>
                      <span>Outfits</span>
                    </div>
                    <div className="profile-stat">
                      <b>{dashboard.favourites}</b>
                      <span>Fav</span>
                    </div>
                  </div>
                </div>
              </section>

              <Card title="Wardrobe Stats">
                <div className="kv">
                  <span className="kv__k">Most worn</span>
                  <span className="kv__v">
                    {dashboard.most_worn}
                    <br />
                    <span className="kv__sub">Worn {dashboard.most_worn_count} times</span>
                  </span>
                </div>
                <div className="kv">
                  <span className="kv__k">Top category</span>
                  <span className="kv__v">{analytics.top_category}</span>
                </div>
                <div className="kv">
                  <span className="kv__k">Favourite brand</span>
                  <span className="kv__v">{analytics.favourite_brand}</span>
                </div>
                <div className="kv">
                  <span className="kv__k">Last added</span>
                  <span className="kv__v">{lastAdded ? lastAdded.name : "—"}</span>
                </div>
              </Card>

              <Card title="Account Settings" bodyClass="card__body--tight">
                <div className="rows">
                  {[
                    ["user", "Edit Profile"],
                    ["bell", "Notifications"],
                    ["settings", "Preferences"],
                  ].map(([icon, label]) => (
                    <button className="row" key={label} style={{ width: "100%", textAlign: "left" }}>
                      <Icon name={icon} size={15} color="var(--muted)" />
                      <span className="row__name">{label}</span>
                      <span className="row__right">
                        <Icon name="chevronRight" size={14} color="var(--muted)" />
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* ---------- right column ---------- */}
            <div className="stack">
              <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                <StatCard
                  icon="wallet"
                  value={`£${analytics.wardrobe_value.toLocaleString("en-GB")}`}
                  label="Wardrobe Value"
                  note="Total paid across all pieces"
                  text
                />
                <StatCard
                  icon="trend"
                  value={`${analytics.average_wears}×`}
                  label="Avg. Wears / Item"
                  note="Higher is better value"
                />
                <StatCard
                  icon="clock"
                  value={dashboard.added_this_week}
                  label="Added This Week"
                  note="New pieces logged"
                />
              </div>

              <div className="grid grid--two">
                <Card
                  title="Categories"
                  action={<Icon name="chart" size={14} />}
                >
                  <DonutChart data={analytics.categories} centreLabel="items" />
                </Card>

                <Card
                  title="Colours in Wardrobe"
                  action={<Icon name="palette" size={14} />}
                >
                  <BarList
                    data={analytics.colours}
                    colourFor={(label) => SWATCHES[label] ?? "var(--ink)"}
                  />
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
