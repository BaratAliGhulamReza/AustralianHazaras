export function renderCitySelector(host, cities, activeCity, onSelect) {
  host.innerHTML = Object.entries(cities).map(([key, city]) => `
    <button class="city-tab" type="button" data-city="${key}" role="tab"
      aria-selected="${key === activeCity}">
      <img class="city-tab__icon" src="${city.icon}" alt="" aria-hidden="true">
      <span class="city-tab__label">${city.name}</span>
    </button>`).join("");
  host.querySelectorAll(".city-tab").forEach(button => {
    button.addEventListener("click", () => onSelect(button.dataset.city));
  });
}
export function setActiveCity(host, activeCity) {
  host.querySelectorAll(".city-tab").forEach(button => {
    button.setAttribute("aria-selected", String(button.dataset.city === activeCity));
  });
}
