import Icon from "./Icon";

/** Page heading strip: title, optional subtitle and right-hand actions. */
export default function Topbar({ title, subtitle, children }) {
  return (
    <header className="topbar">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="topbar__sub">{subtitle}</div>}
      </div>
      <div className="topbar__right">
        {children}
        <button className="iconbtn" aria-label="Notifications">
          <Icon name="bell" size={15} />
        </button>
        <span className="avatar">JA</span>
      </div>
    </header>
  );
}
