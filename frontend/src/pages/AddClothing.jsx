import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { createClothingItem } from "../services/api";

const empty = { name: "", category: "Top", colour: "", occasion: "Casual" };

export default function AddClothing() {
  const [form, setForm] = useState(empty);
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createClothingItem(form);
    navigate("/wardrobe");
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div className="field">
          <label htmlFor="name">Item name</label>
          <input id="name" value={form.name} onChange={update("name")} placeholder="e.g. White Oxford Shirt" required />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={update("category")}>
            <option>Top</option>
            <option>Bottom</option>
            <option>Outerwear</option>
            <option>Footwear</option>
            <option>Accessory</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="colour">Colour</label>
          <input id="colour" value={form.colour} onChange={update("colour")} placeholder="e.g. White" required />
        </div>

        <div className="field">
          <label htmlFor="occasion">Occasion</label>
          <select id="occasion" value={form.occasion} onChange={update("occasion")}>
            <option>Casual</option>
            <option>Formal</option>
            <option>Sport</option>
            <option>Party</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="image">Photo (optional)</label>
          <input id="image" type="file" accept="image/*" />
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <Button type="submit">Save item</Button>
          <Button variant="secondary" onClick={() => navigate("/wardrobe")}>Cancel</Button>
        </div>
      </form>
    </Card>
  );
}
