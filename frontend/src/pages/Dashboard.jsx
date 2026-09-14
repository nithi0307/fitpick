import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

const stats = [
  { label: "Clothing items", value: 42 },
  { label: "Saved outfits", value: 8 },
  { label: "Favourites", value: 5 },
  { label: "Added this week", value: 3 },
];

const recentItems = ["White Oxford Shirt", "Navy Chinos", "Black Sneakers"];

export default function Dashboard() {
  return (
    <>
      <div className="page-header">
        <div>
          <h2>Welcome back</h2>
          <p>Here is a quick overview of your wardrobe.</p>
        </div>
        <Link to="/add-clothing">
          <Button>+ Add clothing</Button>
        </Link>
      </div>

      <div className="grid grid--stats" style={{ marginBottom: 24 }}>
        {stats.map((stat) => (
          <Card key={stat.label} title={stat.label}>
            <div className="stat">{stat.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <Card title="Recently added">
          <ul style={{ listStyle: "none" }}>
            {recentItems.map((item) => (
              <li key={item} style={{ padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Quick actions">
          <div style={{ display: "grid", gap: 10 }}>
            <Link to="/outfit-builder"><Button variant="secondary" block>Build an outfit</Button></Link>
            <Link to="/wardrobe"><Button variant="secondary" block>Browse wardrobe</Button></Link>
          </div>
        </Card>
      </div>
    </>
  );
}
