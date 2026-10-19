/**
 * Who is signed in.
 *
 * FitPick has no authentication yet, so the signed-in identity is simply the
 * name and email given on the login screen, kept in this browser. Every API
 * call carries it so the backend stores each wardrobe against its owner.
 * With no session the app falls back to the demo account.
 */

const KEY = "fitpick.user";

export const DEMO_USER = {
  name: "Jamie Anderson",
  email: "jamie@email.com",
  initials: "JA",
};

/** "Priya Sharma" -> "PS";  "Nithilan" -> "N" */
export function initialsFrom(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

/** "nithilan.a@mail.com" -> "Nithilan A" */
export function nameFromEmail(email) {
  const local = email.split("@")[0] ?? "";
  const words = local.split(/[._\-+]+/).filter(Boolean);
  if (words.length === 0) return email;
  return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export function signIn({ name, email }) {
  const address = (email ?? "").trim().toLowerCase();
  const display = (name ?? "").trim() || nameFromEmail(address);
  const user = { name: display, email: address, initials: initialsFrom(display) };

  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // private browsing: the session simply lasts for this page view
  }
  return user;
}

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    const user = raw ? JSON.parse(raw) : null;
    return user && user.email ? user : null;
  } catch {
    return null;
  }
}

/** The account to display and send with requests. */
export function currentUser() {
  return getSession() ?? DEMO_USER;
}

export function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // nothing to clear
  }
}
