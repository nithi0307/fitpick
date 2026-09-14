// Generic white rounded container with a soft shadow. Pages compose
// stats, clothing items, outfits and forms out of this one element.
export default function Card({ title, children, className = "" }) {
  return (
    <div className={`card ${className}`.trim()}>
      {title && <div className="card__title">{title}</div>}
      {children}
    </div>
  );
}
