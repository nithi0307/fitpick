import Card from "../components/Card";
import Button from "../components/Button";

const breakdown = [
  { category: "Tops", count: 15 },
  { category: "Bottoms", count: 10 },
  { category: "Outerwear", count: 6 },
  { category: "Footwear", count: 7 },
  { category: "Accessories", count: 4 },
];

export default function Profile() {
  return (
    <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
      <Card title="Profile">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" defaultValue="Nithilan" />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" defaultValue="nithilan@example.com" />
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button>Save changes</Button>
          <Button variant="secondary">Change password</Button>
        </div>
      </Card>

      <Card title="Wardrobe analytics">
        {breakdown.map((row) => (
          <div key={row.category} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span>{row.category}</span>
              <span>{row.count}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--bg)" }}>
              <div
                style={{
                  width: `${(row.count / 15) * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: "var(--blue)",
                }}
              />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
