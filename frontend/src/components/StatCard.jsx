import Icon from "./Icon";

/** One figure on the dashboard: icon, live badge, value, label and a note. */
export default function StatCard({ icon, value, label, note, text = false }) {
  return (
    <article className="stat">
      <div className="stat__top">
        <span className="stat__icon">
          <Icon name={icon} size={15} />
        </span>
        <span className="stat__live">
          <i className="stat__dot" /> Live
        </span>
      </div>
      <div className={`stat__value ${text ? "stat__value--text" : ""}`.trim()}>{value}</div>
      <div className="stat__label">{label}</div>
      {note && <div className="stat__delta">{note}</div>}
    </article>
  );
}
