import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import { currentUser, signOut } from "../services/session";

/**
 * Account menu. Used twice: as the chip in the sidebar footer and as the
 * avatar in the top bar. Both open the same menu, so there is one definition
 * of what the account actions are.
 */


export default function UserMenu({ variant = "chip", align = "up" }) {
  const user = currentUser();
  const [open, setOpen] = useState(false);
  const container = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;

    function handlePointerDown(event) {
      if (!container.current?.contains(event.target)) setOpen(false);
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function go(path) {
    setOpen(false);
    navigate(path);
  }

  function logOut() {
    setOpen(false);
    signOut();
    navigate("/");
  }

  return (
    <div className="menu" ref={container}>
      {variant === "chip" ? (
        <button
          type="button"
          className={`userchip ${open ? "userchip--open" : ""}`.trim()}
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="avatar">{user.initials}</span>
          <span className="userchip__text">
            <span className="userchip__name">{user.name}</span>
            <span className="userchip__mail">{user.email}</span>
          </span>
          <Icon name={open ? "chevronDown" : "chevronUp"} size={14} color="var(--muted)" />
        </button>
      ) : (
        <button
          type="button"
          className="avatar avatar--button"
          onClick={() => setOpen((value) => !value)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Account menu"
        >
          {user.initials}
        </button>
      )}

      {open && (
        <div className={`menu__panel menu__panel--${align}`} role="menu">
          <div className="menu__head">
            <span className="userchip__name">{user.name}</span>
            <span className="userchip__mail">{user.email}</span>
          </div>

          <button className="menu__item" role="menuitem" onClick={() => go("/profile")}>
            <Icon name="user" size={15} /> View profile
          </button>
          <div className="menu__separator" />

          <button
            className="menu__item menu__item--danger"
            role="menuitem"
            onClick={logOut}
          >
            <Icon name="logout" size={15} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
