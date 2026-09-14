// The only place in the frontend that knows the backend URL and how to
// talk to it. Pages call these functions and receive plain JavaScript
// objects, so swapping the backend or its URL touches this file only.

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getClothingItems() {
  return request("/clothing");
}

export function createClothingItem(item) {
  return request("/clothing", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function getOutfits() {
  return request("/outfits");
}
