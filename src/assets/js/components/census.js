import { formatCount, hasCompleteCounts } from "../utils/shared.js";

function numberCard(label, value, detail, extraClass = "") {
  return `
    <div class="number-card ${extraClass}">
      <h4>${label}</h4>
      <strong>${value}</strong>
      <span>${detail}</span>
    </div>`;
}

export function renderCensusPanels(host, national) {
  const year2021 = national["2021"] ?? {};
  const year2026 = national["2026"] ?? {};
  const released2026 = hasCompleteCounts(year2026);

  host.innerHTML = `
    <article class="census-panel">
      <div class="census-panel__heading">
        <h3>2021 Census</h3>
        <span class="status-badge">Official ABS data</span>
      </div>

      <div class="number-grid">
        ${numberCard(
          "Hazara ancestry",
          formatCount(year2021.hazaraAncestry, "—"),
          "People in Australia",
        )}
        ${numberCard(
          "Hazaragi language used at home",
          formatCount(year2021.hazaragiLanguage, "—"),
          "People in Australia",
        )}
      </div>

      <p class="census-source">
        Source: Australian Bureau of Statistics.
        <a href="${national.source2021}" target="_blank" rel="noopener">
          View ABS source ↗
        </a>
      </p>
    </article>

    <article class="census-panel census-panel--future">
      <div class="census-panel__heading">
        <h3>2026 Census</h3>
        <span class="status-badge">
          ${released2026 ? "Official ABS data" : "Coming soon"}
        </span>
      </div>

      <div class="number-grid">
        ${numberCard(
          "Hazara ancestry",
          released2026
            ? formatCount(year2026.hazaraAncestry)
            : "—",
          released2026
            ? "People in Australia"
            : "Official number will appear after release",
          released2026 ? "" : "number-card--pending",
        )}
        ${numberCard(
          "Hazaragi language used at home",
          released2026
            ? formatCount(year2026.hazaragiLanguage)
            : "—",
          released2026
            ? "People in Australia"
            : "Official number will appear after release",
          released2026 ? "" : "number-card--pending",
        )}
      </div>
    </article>`;
}

import { censusBenefitIcons } from "../icons/census-benefit-icons.js";


export function renderBenefits(host, benefits) {
  host.innerHTML = benefits.map(benefit => `
    <article class="benefit-card">
      <div class="benefit-card__icon">
        ${censusBenefitIcons[benefit.icon] ?? ""}
      </div>
      <h3>${benefit.title}</h3>
      <p>${benefit.description}</p>
    </article>
  `).join("");
}
