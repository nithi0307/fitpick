/**
 * Decorative artwork for the login screen: a clothing rail of hanging
 * garments, drawn as SVG so the page needs no photography.
 */

const RAIL = [
  { x: 52, len: 150, w: 54, fill: "#EDE7DC", skew: -2 },
  { x: 118, len: 168, w: 48, fill: "#DED6C7", skew: 1 },
  { x: 180, len: 158, w: 52, fill: "#F2EEE6", skew: -1 },
  { x: 246, len: 182, w: 50, fill: "#C9BCA6", skew: 2 },
  { x: 308, len: 162, w: 54, fill: "#A89781", skew: -2 },
  { x: 374, len: 176, w: 48, fill: "#7C6B57", skew: 1 },
  { x: 434, len: 156, w: 52, fill: "#4A4A52", skew: -1 },
  { x: 498, len: 172, w: 50, fill: "#2E2F36", skew: 2 },
  { x: 560, len: 160, w: 54, fill: "#55565F", skew: -2 },
];

function Hanging({ x, len, w, fill, skew }) {
  const top = 150;
  const half = w / 2;
  const bottom = top + len;

  return (
    <g transform={`rotate(${skew} ${x} ${top})`}>
      {/* hanger */}
      <path
        d={`M${x} ${top - 34} a5 5 0 1 1 0.1 0 M${x} ${top - 28} v8 M${x - half + 8} ${top} L${x} ${top - 20} L${x + half - 8} ${top}`}
        fill="none"
        stroke="#9a9384"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* shoulders + body */}
      <path
        d={`M${x - half + 6} ${top + 2}
            Q${x} ${top - 12} ${x + half - 6} ${top + 2}
            L${x + half} ${top + 34}
            L${x + half - 7} ${bottom}
            Q${x} ${bottom + 12} ${x - half + 7} ${bottom}
            L${x - half} ${top + 34} Z`}
        fill={fill}
        opacity="0.95"
      />
      <path
        d={`M${x} ${top + 4} L${x} ${bottom + 4}`}
        stroke="rgba(0,0,0,.14)"
        strokeWidth="1.4"
        fill="none"
      />
    </g>
  );
}

export default function HeroArt() {
  return (
    <svg
      className="hero__art"
      viewBox="0 0 640 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-bg" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#D9D3C7" />
          <stop offset="55%" stopColor="#BDB5A6" />
          <stop offset="100%" stopColor="#8A8477" />
        </linearGradient>
        <linearGradient id="hero-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>

      <rect width="640" height="760" fill="url(#hero-bg)" />
      <rect width="640" height="420" fill="url(#hero-wall)" />

      {/* rail */}
      <rect x="18" y="112" width="604" height="7" rx="3.5" fill="#6f6a60" />
      <rect x="18" y="112" width="604" height="2.5" rx="1.2" fill="#8e887c" />
      <rect x="26" y="86" width="7" height="30" rx="3" fill="#6f6a60" />
      <rect x="607" y="86" width="7" height="30" rx="3" fill="#6f6a60" />

      {RAIL.map((garment) => (
        <Hanging key={garment.x} {...garment} />
      ))}

      {/* floor shadow */}
      <ellipse cx="320" cy="690" rx="300" ry="54" fill="rgba(60,54,44,.18)" />
    </svg>
  );
}
