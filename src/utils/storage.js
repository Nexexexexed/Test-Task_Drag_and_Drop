const KEY = "poly-data";

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function clear() {
  localStorage.removeItem(KEY);
}
