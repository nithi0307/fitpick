import { useLocation } from "react-router-dom";

const titles = {
  "/dashboard": "Dashboard",
  "/wardrobe": "My Wardrobe",
  "/add-clothing": "Add Clothing Item",
  "/outfit-builder": "Outfit Builder",
  "/profile": "Profile & Analytics",
};

// Top bar: shows the current page title and the signed-in user.
export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="navbar">
      <h1 className="navbar__title">{titles[pathname] ?? "FitPick"}</h1>
      <div className="navbar__user">
        <span>Nithilan</span>
        <div className="avatar">N</div>
      </div>
    </header>
  );
}
