/**
 * Two small charts drawn directly as SVG/CSS.
 *
 * A charting library would add roughly 100 kB to the bundle for two shapes,
 * so the donut is a stroked circle and the bars are divs.
 */

const SERIES = ["#3b6ff6", "#15161a", "#8fb4f6", "#a9aeb7", "#d7dbe2", "#eef3ff"];

export function DonutChart({ data, size = 148, thickness = 20, centreLabel = "items" }) {
  const total = data.reduce((sum, row) => sum + row.count, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let consumed = 0;

  return (
    <div className="donut-wrap">
      <div className="donut" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label="Wardrobe by category">
          <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
            <circle
              cx={size / 2} cy={size / 2} r={radius}
              fill="none" stroke="#f0f2f5" strokeWidth={thickness}
            />
            {total > 0 &&
              data.map((row, index) => {
                const length = (row.count / total) * circumference;
                const dash = `${Math.max(length - 2, 0)} ${circumference - Math.max(length - 2, 0)}`;
                const offset = -consumed;
                consumed += length;
                return (
                  <circle
                    key={row.label}
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none"
                    stroke={SERIES[index % SERIES.length]}
                    strokeWidth={thickness}
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                  />
                );
              })}
          </g>
        </svg>
        <div className="donut__centre">
          <div className="donut__value">{total}</div>
          <div className="donut__label">{centreLabel}</div>
        </div>
      </div>

      <div className="legend" style={{ flex: 1 }}>
        {data.map((row, index) => (
          <div className="legend__row" key={row.label}>
            <span className="legend__dot" style={{ background: SERIES[index % SERIES.length] }} />
            <span>{row.label}</span>
            <span className="legend__count">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarList({ data, colourFor }) {
  const max = Math.max(...data.map((row) => row.count), 1);

  return (
    <div className="bars">
      {data.map((row) => (
        <div key={row.label}>
          <div className="bar__top">
            <span>{row.label}</span>
            <span className="bar__count">{row.count}</span>
          </div>
          <div className="bar__track">
            <div
              className="bar__fill"
              style={{
                width: `${(row.count / max) * 100}%`,
                background: colourFor ? colourFor(row.label) : undefined,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
