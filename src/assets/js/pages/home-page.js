import { renderCitySelector, setActiveCity } from "../components/city-selector.js";
import { createCityContentTabs } from "../components/city-sections.js";
import { applyTemplate, setText } from "../utils/shared.js";
import { bootstrapPage } from "../utils/page-bootstrap.js";
import { getQueryValue, setQueryValue } from "../utils/url-state.js";
import { preloadResponsiveBanner, setResponsiveBanner } from "../utils/responsive-image.js";

bootstrapPage({
  currentPage: "home",
  data: {
    site: "content/site.json",
    cities: "content/cities.json",
    categories: "content/categories.json",
    articles: "content/articles.json",
  },
  render: async ({ site, cities, categories, articles }) => {
    const banner = document.getElementById("city-banner");
    const selector = document.getElementById("city-selector");
    const tabList = document.getElementById("city-tab-list");
    const tabPanel = document.getElementById("city-tab-panel");

    setText("home-eyebrow", site.home.eyebrow);
    setText("home-census-link", `${site.home.censusButton} →`);

    async function showCity(key) {
      const city = cities.cities[key];
      if (!city) return;

      setText("city-title", city.name);
      setText("city-description", city.intro);
      setText("city-sections-heading", applyTemplate(site.home.sectionHeading, { city: city.name }));
      setText("city-sections-description", applyTemplate(site.home.sectionDescription, { city: city.name }));
      createCityContentTabs({
        tabHost: tabList,
        panelHost: tabPanel,
        definitions: categories.definitions,
        articles: articles.articles,
        cityName: city.name,
        cityKey: key,
        defaultTab: categories.defaultTab,
      });
      setActiveCity(selector, key);
      setQueryValue("location", key);

      const currentSource = banner.getAttribute("src") || "";
      if (!currentSource.includes(city.banner)) {
        preloadResponsiveBanner(city.banner)
          .then(() => setResponsiveBanner(banner, city.banner, `${city.name} city banner`))
          .catch(() => {});
      } else {
        banner.alt = `${city.name} city banner`;
      }
    }

    const requested = getQueryValue("location", cities.defaultCity);
    const initial = cities.cities[requested] ? requested : cities.defaultCity;
    renderCitySelector(selector, cities.cities, initial, showCity);
    await showCity(initial);
  },
});
