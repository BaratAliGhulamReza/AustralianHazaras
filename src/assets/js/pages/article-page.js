import { bootstrapPage } from "../utils/page-bootstrap.js";
import { escapeHtml as esc } from "../utils/html.js";
import { getQueryValue } from "../utils/url-state.js";

function renderBody(blocks = []) {
  return blocks.map(block => {
    if (block.type === "heading") return `<h2>${esc(block.text || "")}</h2>`;
    if (block.type === "quote") return `<blockquote>${esc(block.text || "")}</blockquote>`;
    return `<p>${esc(block.text || "")}</p>`;
  }).join("");
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
    const article = articles.articles.find(item => item.slug === slug && item.status === "published");
    const root = document.getElementById("article-root");
    if (!article) {
      document.title = `Story not found | ${site.brand.name}`;
      root.innerHTML = `<section class="article-shell"><h1>Story not found</h1><p>The requested story is unavailable.</p><a class="button article-back" href="index.html">← Back to home</a></section>`;
      return;
    }
    const category = categories.definitions.find(item => item.key === article.category);
    const city = cities.cities[article.city];
    const categoryTitle = category?.title || "Story";
    const cityName = city?.name || "Australia";
    const backUrl = `index.html?location=${encodeURIComponent(article.city)}`;
    document.title = `${article.title} | ${site.brand.name}`;
    root.innerHTML = `
      <nav class="article-breadcrumb" aria-label="Breadcrumb"><a href="${backUrl}">${esc(cityName)}</a><span>/</span><span>${esc(categoryTitle)}</span></nav>
      <article class="article-shell">
        <header class="article-header"><span class="article-badge">${esc(categoryTitle)}</span><h1>${esc(article.title)}</h1><p class="article-deck">${esc(article.summary)}</p><div class="article-meta"><span>${esc(article.publishedAt)}</span><span>${esc(cityName)}</span><span>${esc(article.author)}</span></div></header>
        <div class="article-layout"><div class="article-main">
          ${article.image ? `<img class="article-hero-image" src="${esc(article.image.src)}" alt="${esc(article.image.alt || "")}" width="1600" height="700" decoding="async">` : ""}
          <div class="article-copy-placeholder">${renderBody(article.body)}</div>
        </div></div>
        <footer class="article-actions"><a class="button article-back" href="${backUrl}">← Back to ${esc(categoryTitle)}</a></footer>
      </article>`;
  },
});
