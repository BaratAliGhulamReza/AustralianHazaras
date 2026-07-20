export function getQueryValue(key, fallback = "") {
  return new URLSearchParams(location.search).get(key) || fallback;
}

export function setQueryValue(key, value) {
  const url = new URL(location.href);
  url.searchParams.set(key, value);
  history.replaceState({}, "", url);
}
