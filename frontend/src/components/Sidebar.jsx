import { Link, NavLink } from "react-router-dom";
import Icon from "./Icon";
import UserMenu from "./UserMenu";

/**
 * Primary navigation. The link list is data, so adding a screen means one
 * entry here plus one <Route> in App.jsx.
 */
const MENU = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/wardrobe", label: "My Wardrobe", icon: "hanger" },
  { to: "/outfit-builder", label: "Outfit Builder", icon: "layers" },
  { to: "/profile", label: "Analytics", icon: "chart" },
];

const LIBRARY = [{ to: "/add-clothing", label: "Add Clothing", icon: "plus" }];

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "nav__link nav__link--active" : "nav__link")}
    >
      <Icon name={icon} size={16} />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="brand" aria-label="FitPick home">
        <span className="brand__mark">
          <Icon name="sparkle" size={15} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="brand__name">FitPick</span>
      </Link>

      <nav>
        <div className="nav__group">
          <div className="nav__label">Menu</div>
          {MENU.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>

        <div className="nav__group">
          <div className="nav__label">Library</div>
          {LIBRARY.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </div>
      </nav>

      <div className="sidebar__foot">
        <UserMenu variant="chip" align="up" />
      </div>
    </aside>
  );
}
