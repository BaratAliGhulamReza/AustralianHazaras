// Shared DOM and formatting utilities.

export function setText(id, value = "") {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

export function formatCount(value, fallback = "Coming soon") {
  const number = Number(value);
  return Number.isFinite(number)
    ? new Intl.NumberFormat("en-AU").format(number)
    : fallback;
}

export function hasCompleteCounts(record = {}) {
  return Number.isFinite(Number(record.hazaraAncestry))
    && Number.isFinite(Number(record.hazaragiLanguage));
}

export function applyTemplate(template = "", values = {}) {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}

