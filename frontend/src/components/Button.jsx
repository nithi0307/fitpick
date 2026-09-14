// Single button component used across every page so all buttons share
// the same look. The `variant` prop selects the style; callers never
// touch CSS directly.
export default function Button({
  children,
  variant = "primary",
  block = false,
  type = "button",
  onClick,
}) {
  const classes = ["btn", `btn--${variant}`, block ? "btn--block" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
