/**
 * Draws a clothing item as an SVG silhouette tinted with its own colour, so
 * the wardrobe looks consistent without shipping photographs. Swapping this
 * component for real uploaded images later changes nothing else.
 */

import { SHAPES, paletteFor, shapeFor } from "./garmentShapes";

export default function Garment({ item, background = "#EBEDF2" }) {
  const [fill, edge, light] = paletteFor(item.colour);
  const name = shapeFor(item);
  const shape = SHAPES[name];
  const id = `g-${name}-${(item.colour || "x").replace(/\W/g, "")}`;

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${item.colour} ${item.name}`}>
      <defs>
        <linearGradient id={id} x1="0.15" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={fill} />
        </linearGradient>
        <radialGradient id={`${id}-bg`} cx="50%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FAFBFD" />
          <stop offset="100%" stopColor={background} />
        </radialGradient>
      </defs>

      <rect width="200" height="200" fill={`url(#${id}-bg)`} />

      <g strokeLinejoin="round" strokeLinecap="round">
        <path d={shape.body} fill={`url(#${id})`} stroke={edge} strokeWidth="1.6" />

        {shape.detail?.map((d) => (
          <path key={d} d={d} fill={edge} opacity="0.18" stroke={edge} strokeWidth="1.3" />
        ))}

        {shape.rib?.map((d) => (
          <path key={d} d={d} fill={edge} opacity="0.2" stroke="none" />
        ))}

        {shape.line?.map((d) => (
          <path key={d} d={d} fill="none" stroke={edge} strokeWidth="1.4" opacity="0.6" />
        ))}

        {shape.handle?.map((d) => (
          <path key={d} d={d} fill="none" stroke={edge} strokeWidth="5.5" />
        ))}

        {shape.dot?.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill={edge} opacity="0.55" />
        ))}
      </g>
    </svg>
  );
}
