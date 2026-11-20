
/* LUXRIDE — API SERVICE */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = sessionStorage.getItem("luxride_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed: ${response.status}`
    );
  }

  return data;
}
