import { bootstrapPage } from "../utils/page-bootstrap.js";
import { escapeHtml as esc } from "../utils/html.js";
import { getQueryValue } from "../utils/url-state.js";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-AU", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function renderBody(blocks = []) {
  return blocks.map((block) => {
    if (block.type === "heading") return `<h2>${esc(block.text || "")}</h2>`;
    if (block.type === "quote") return `<blockquote><span aria-hidden="true">“</span><p>${esc(block.text || "")}</p></blockquote>`;
    if (block.type === "image") return `<figure class="article-inline-image"><img src="${esc(block.src || "")}" alt="${esc(block.alt || "")}" loading="lazy" decoding="async"><figcaption>${esc(block.caption || "")}</figcaption></figure>`;
    return `<p>${esc(block.text || "")}</p>`;
  }).join("");
}

function defaultGlance(article, cityName, categoryTitle) {
  const values = article.atGlance?.filter((item) => item.label || item.value) || [];
  if (values.length) return values;
  return [
    { label: categoryTitle, value: "Community story" },
    { label: cityName, value: "Local community" },
    { label: article.featured ? "Featured story" : "Positive change", value: "Community impact" },
  ];
}

function relatedArticles(allArticles, article, cities) {
  return allArticles.filter((item) => item.status === "published" && item.slug !== article.slug)
    .sort((a, b) => Number(b.city === article.city) - Number(a.city === article.city))
    .slice(0, 4)
    .map((item) => ({ ...item, cityName: cities.cities[item.city]?.name || "Australia" }));
}

bootstrapPage({
  currentPage: "home",
  data: {
    site: "content/site.json",
    categories: "content/categories.json",
    cities: "content/cities.json",
    articles: "content/articles.json",
  },
  render: ({ site, categories, cities, articles }) => {
    const slug = getQueryValue("slug", "");
    const article = articles.articles.find((item) => item.slug === slug && item.status === "published");
    const root = document.getElementById("article-root");
    if (!article) {
      document.title = `Story not found | ${site.brand.name}`;
      root.innerHTML = `<section class="article-not-found"><h1>Story not found</h1><p>The requested story is unavailable.</p><a class="button article-back" href="index.html">← Back to home</a></section>`;
      return;
    }

    const category = categories.definitions.find((item) => item.key === article.category);
    const city = cities.cities[article.city];
    const categoryTitle = category?.title || "Story";
    const cityName = city?.name || "Australia";
    const backUrl = `index.html?location=${encodeURIComponent(article.city)}`;
    const glance = defaultGlance(article, cityName, categoryTitle);
    const links = article.relatedLinks?.filter((item) => item.label && item.href) || [];
    const related = relatedArticles(articles.articles, article, cities);

    document.title = `${article.title} | ${site.brand.name}`;
    root.innerHTML = `
      <nav class="article-breadcrumb" aria-label="Breadcrumb"><a href="${backUrl}">${esc(cityName)}</a><span>/</span><span>${esc(categoryTitle)}</span></nav>
      <article class="article-shell">
        <header class="article-header">
          <span class="article-badge">${article.featured ? "Featured story" : esc(categoryTitle)}</span>
          <h1>${esc(article.title)}</h1>
          <p class="article-deck">${esc(article.summary)}</p>
          <div class="article-meta">
            <span><b aria-hidden="true">▣</b>${esc(formatDate(article.publishedAt))}</span>
            <span><b aria-hidden="true">⌖</b>${esc(cityName)}</span>
            <span><b aria-hidden="true">♙</b>By ${esc(article.author)}</span>
          </div>
        </header>

        <div class="article-layout">
          <main class="article-main">
            ${article.image?.src ? `<div class="article-hero-frame"><img class="article-hero-image" src="${esc(article.image.src)}" alt="${esc(article.image.alt || "")}" decoding="async" fetchpriority="high"></div>` : ""}
            <div class="article-copy">${renderBody(article.body)}</div>
            <footer class="article-credit">
              <div><span>Source</span><strong>${esc(article.source || "Australian Hazara Community")}</strong></div>
              <div><span>Contributor</span><strong>${esc(article.contributor || article.author)}</strong></div>
            </footer>
          </main>

          <aside class="article-sidebar">
            <section class="article-side-card">
              <h2>At a glance</h2>
              <div class="glance-list">${glance.map((item, index) => `<div class="glance-item"><span class="glance-icon">${index === 0 ? "◎" : index === 1 ? "♙" : index === 2 ? "⌖" : "♡"}</span><div><strong>${esc(item.label)}</strong><span>${esc(item.value)}</span></div></div>`).join("")}</div>
            </section>

            ${(links.length || related.length) ? `<section class="article-side-card related-info"><h2>Related information</h2>${links.map((item) => `<a href="${esc(item.href)}">${esc(item.label)}<span>›</span></a>`).join("")}${related.slice(0, Math.max(0, 4 - links.length)).map((item) => `<a href="article.html?slug=${encodeURIComponent(item.slug)}">${esc(item.title)}<span>›</span></a>`).join("")}</section>` : ""}
          </aside>
        </div>

      </article>`;
  },
});
