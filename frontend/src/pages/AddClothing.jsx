import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import Topbar from "../components/Topbar";
import { createClothingItem } from "../services/api";

const CATEGORIES = ["Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];
const SUBCATEGORIES = {
  Tops: ["T-Shirt", "Shirt", "Knitwear", "Sweatshirt"],
  Bottoms: ["Trousers", "Jeans", "Shorts"],
  Dresses: ["Midi Dress", "Maxi Dress"],
  Outerwear: ["Blazer", "Coat"],
  Shoes: ["Sneakers", "Boots"],
  Accessories: ["Bag", "Belt"],
};
const SEASONS = ["S/S", "F/W", "All Season"];
const SIZES = ["XS", "S", "M", "L", "XL"];

const BLANK = {
  name: "",
  category: "",
  subcategory: "",
  colour: "",
  season: "All Season",
  brand: "",
  size: "",
  price: "",
  notes: "",
};

/** Add Clothing Item: one form that creates a wardrobe entry. */
export default function AddClothing() {
  const [form, setForm] = useState(BLANK);
  const [tags, setTags] = useState(["Casual", "Office"]);
  const [draftTag, setDraftTag] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  function addTag(event) {
    event.preventDefault();
    const value = draftTag.trim();
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setDraftTag("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await createClothingItem({
        ...form,
        price: Number(form.price) || 0,
        tags,
      });
      navigate("/wardrobe");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Topbar title="Add Clothing Item" subtitle="Add a new piece to your wardrobe" />

      <div className="content">
        <form className="grid" style={{ gridTemplateColumns: "300px minmax(0, 1fr)" }} onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 16, alignSelf: "start", display: "grid", gap: 14 }}>
            <div className="upload">
              <span className="upload__icon">
                <Icon name="upload" size={18} />
              </span>
              <span className="upload__title">Upload Photo</span>
              <span className="upload__hint">Drag &amp; drop or click to browse</span>
              <label className="btn btn--primary" style={{ marginTop: 6 }}>
                Choose File
                <input type="file" accept="image/*" hidden />
              </label>
            </div>

            <div className="note">
              <div className="note__title">
                <Icon name="sparkle" size={13} /> Illustrated preview
              </div>
              <div className="note__text">
                Until a photo is uploaded, FitPick draws the piece from its category and colour so
                your wardrobe stays visually consistent.
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div className="form-grid">
              <div className="field">
                <label className="field__label" htmlFor="name">
                  Clothing name <span className="req">*</span>
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Classic White Oxford Shirt"
                  required
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="category">
                    Category <span className="req">*</span>
                  </label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value, subcategory: "" })}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="subcategory">Subcategory</label>
                  <select
                    id="subcategory"
                    value={form.subcategory}
                    onChange={set("subcategory")}
                    disabled={!form.category}
                  >
                    <option value="">Select subcategory</option>
                    {(SUBCATEGORIES[form.category] ?? []).map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="colour">
                    Primary colour <span className="req">*</span>
                  </label>
                  <input
                    id="colour"
                    value={form.colour}
                    onChange={set("colour")}
                    placeholder="e.g. Navy"
                    required
                  />
                </div>

                <div className="field">
                  <span className="field__label">Season</span>
                  <div className="segmented">
                    {SEASONS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={form.season === name}
                        onClick={() => setForm({ ...form, season: name })}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="brand">Brand</label>
                  <input id="brand" value={form.brand} onChange={set("brand")} placeholder="e.g. Arket" />
                </div>

                <div className="field">
                  <span className="field__label">Size</span>
                  <div className="segmented">
                    {SIZES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={form.size === name}
                        onClick={() => setForm({ ...form, size: name })}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label className="field__label" htmlFor="price">Price paid (£)</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={set("price")}
                    placeholder="0.00"
                  />
                </div>

                <div className="field">
                  <span className="field__label">Tags</span>
                  <div className="tagbox">
                    {tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                        <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`}>
                          <Icon name="close" size={10} strokeWidth={2.4} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={draftTag}
                      onChange={(event) => setDraftTag(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && addTag(event)}
                      placeholder="Add tag…"
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Purchased in Paris, runs small, hand wash only…"
                />
              </div>

              <div style={{ display: "flex", gap: 10, paddingTop: 2 }}>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save to Wardrobe"}
                </Button>
                <Button variant="ghost" onClick={() => navigate("/wardrobe")}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
