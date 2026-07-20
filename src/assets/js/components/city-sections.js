import { citySectionIcons } from "../icons/city-section-icons.js";

function renderStoryPlaceholder(section, cityName, cityKey) {
  const href = `article.html?placeholder=1&category=${encodeURIComponent(section.key)}&city=${encodeURIComponent(cityKey)}`;
  return `
    <div class="story-list">
      <a class="story-card story-card--template" href="${href}" aria-label="Open the ${section.title} full-page placeholder">
        <div class="story-card__image story-card__image--template" aria-hidden="true">
          <span>Article image</span>
        </div>
        <div class="story-card__content">
          <span class="story-card__badge">${section.title}</span>
          <h4>Your ${section.title.toLowerCase()} story headline will appear here</h4>
          <p>A short introduction or summary will appear here after an approved story is published.</p>
          <div class="story-card__meta">
            <span>Date</span><span>${cityName}</span><span>Author</span>
          </div>
        </div>
        <span class="story-card__arrow" aria-hidden="true">→</span>
      </a>
    </div>`;
}

export function createCityContentTabs({ tabHost, panelHost, definitions, cityName, cityKey = "melbourne", defaultTab = "news" }) {
  let activeKey = definitions.some(section => section.key === defaultTab) ? defaultTab : definitions[0]?.key;

  function renderPanel(section) {
    panelHost.setAttribute("aria-labelledby", `city-tab-${section.key}`);
    panelHost.innerHTML = `
      <div class="city-tab-panel__header">
        <div class="city-tab-panel__icon">${citySectionIcons[section.icon] ?? ""}</div>
        <div>
          <p class="city-tab-panel__eyebrow">${cityName}</p>
          <h3>${section.title}</h3>
          <p>${section.purpose}</p>
        </div>
      </div>
      <div class="city-tab-panel__body">${renderStoryPlaceholder(section, cityName, cityKey)}</div>`;
  }

  function centerTab(button, behavior = "smooth") {
    if (!button || window.matchMedia("(min-width: 651px)").matches) return;
    const left = button.offsetLeft - (tabHost.clientWidth - button.offsetWidth) / 2;
    tabHost.scrollTo({ left, behavior });
  }

  function selectTab(key, behavior = "smooth") {
    activeKey = key;
    tabHost.querySelectorAll(".city-content-tab").forEach(button => {
      const selected = button.dataset.section === activeKey;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const section = definitions.find(item => item.key === activeKey);
    if (section) renderPanel(section);
    centerTab(tabHost.querySelector(`[data-section="${activeKey}"]`), behavior);
  }

  tabHost.innerHTML = definitions.map(section => `
    <button id="city-tab-${section.key}" class="city-content-tab" type="button" role="tab"
      data-section="${section.key}" aria-selected="${section.key === activeKey}"
      aria-controls="city-tab-panel" tabindex="${section.key === activeKey ? 0 : -1}">
      <span class="city-content-tab__icon">${citySectionIcons[section.icon] ?? ""}</span>
      <span>${section.title}</span>
    </button>`).join("");

  tabHost.querySelectorAll(".city-content-tab").forEach(button => {
    button.addEventListener("click", () => selectTab(button.dataset.section));
    button.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const buttons = [...tabHost.querySelectorAll(".city-content-tab")];
      const index = buttons.indexOf(button);
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      buttons[next].focus();
      selectTab(buttons[next].dataset.section);
    });
  });

  selectTab(activeKey, "auto");
  requestAnimationFrame(() => centerTab(tabHost.querySelector(`[data-section="${activeKey}"]`), "auto"));
}
