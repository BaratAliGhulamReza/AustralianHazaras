async function loadJson(path) {
  const inline = window.__PAGE_DATA__;
  if (inline && Object.prototype.hasOwnProperty.call(inline, path)) {
    return inline[path];
  }

  const response = await fetch(path, { cache: "force-cache" });
  if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
  return response.json();
}

export async function loadWebsiteData(paths) {
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, path]) => [key, await loadJson(path)]),
  );
  return Object.fromEntries(entries);
}
