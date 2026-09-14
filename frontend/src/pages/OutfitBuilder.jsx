import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";

const slots = ["Top", "Bottom", "Outerwear", "Footwear"];

// Outfit Builder: one slot per clothing category; the user picks an
// item for each slot and saves the combination as an outfit.
export default function OutfitBuilder() {
  const [outfit, setOutfit] = useState({});

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Create an outfit</h2>
          <p>Pick one item for each slot, then save it.</p>
        </div>
        <Button>Save outfit</Button>
      </div>

      <div className="grid grid--items">
        {slots.map((slot) => (
          <Card key={slot} title={slot}>
            <div className="item-card__image">
              {outfit[slot] ?? "Empty slot"}
            </div>
            <Button
              variant="secondary"
              block
              onClick={() => setOutfit({ ...outfit, [slot]: `Sample ${slot}` })}
            >
              Choose {slot.toLowerCase()}
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}
