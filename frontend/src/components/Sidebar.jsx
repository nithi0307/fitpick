import { NavLink } from "react-router-dom";

// The navigation links live in one list so adding a page means adding
// one entry here and one <Route> in App.jsx – nothing else changes.
const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/wardrobe", label: "My Wardrobe" },
  { to: "/add-clothing", label: "Add Clothing" },
  { to: "/outfit-builder", label: "Outfit Builder" },
  { to: "/profile", label: "Profile" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">FitPick</div>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <NavLink to="/" className="sidebar__link">
          Log out
        </NavLink>
      </div>
    </aside>
  );
}
