/** White rounded panel with an optional titled header. */
export default function Card({ title, action, children, bodyClass = "", className = "" }) {
  return (
    <section className={`card ${className}`.trim()}>
      {title && (
        <header className="card__head">
          <h3 className="card__title">{title}</h3>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}
      <div className={`card__body ${bodyClass}`.trim()}>{children}</div>
    </section>
  );
}
