/**
 * The only button in the application.
 * `variant` picks the style; callers never write CSS of their own.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  block = false,
  between = false,
  type = "button",
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "lg" && "btn--lg",
    block && "btn--block",
    between && "btn--between",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
