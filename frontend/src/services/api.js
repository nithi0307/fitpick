/**
 * The only module that knows the backend URL and how to talk to it.
 * Pages call these functions and receive plain JavaScript objects, so the
 * API can move or change shape without touching any screen.
 */

// In a deployed build the API is served from the same origin as the page, so
// the base URL is empty. In development Vite serves the app on 5173 while the
// API runs on 8000, so an absolute address is needed.
const BASE_URL =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:8000" : "");

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}

function query(params) {
  const search = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== "" && value != null)
  );
  return search.toString() ? `?${search}` : "";
}

/* ---------- clothing ---------- */

export const getClothingItems = (filters = {}) => request(`/clothing${query(filters)}`);

export const createClothingItem = (item) =>
  request("/clothing", { method: "POST", body: JSON.stringify(item) });

export const updateClothingItem = (id, changes) =>
  request(`/clothing/${id}`, { method: "PUT", body: JSON.stringify(changes) });

export const deleteClothingItem = (id) => request(`/clothing/${id}`, { method: "DELETE" });

export const toggleClothingFavourite = (id) =>
  request(`/clothing/${id}/favourite`, { method: "POST" });

/* ---------- outfits ---------- */

export const getOutfits = () => request("/outfits");

export const createOutfit = (outfit) =>
  request("/outfits", { method: "POST", body: JSON.stringify(outfit) });

export const toggleOutfitFavourite = (id) => request(`/outfits/${id}/favourite`, { method: "POST" });

/* ---------- statistics ---------- */

export const getDashboardStats = () => request("/stats/dashboard");

export const getAnalytics = () => request("/stats/analytics");
