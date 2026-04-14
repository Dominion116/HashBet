const configuredApiBase = import.meta.env.VITE_API_BASE_URL;

export const API_BASE = (
  configuredApiBase && configuredApiBase.trim().length > 0
    ? configuredApiBase
    : "https://hashbet.onrender.com"
).replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
