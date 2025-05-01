// src/lib/api.js

// Read VITE_API_BASE at build time, fall back to localhost in dev
const API_BASE = import.meta.env.VITE_API_BASE ?? "";

/**
 * Wrapper around fetch() that prepends the API base URL.
 * @param {string} path   - e.g. "/api/news"
 * @param {RequestInit} opts
 * @returns {Promise<Response>}
 */
export function apiFetch(path, opts = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...opts,
    credentials: "include",  // if you need cookies/auth
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
}
