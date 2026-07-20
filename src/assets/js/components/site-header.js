function buildLink(item, currentPage) {
  const current = item.page === currentPage ? ' aria-current="page"' : "";
  return `<a class="site-nav__link" href="${item.href}"${current}>${item.label}</a>`;
}

export function renderSiteHeader(host, site, currentPage) {
  host.innerHTML = `
    <header class="site-header">
      <div class="container site-nav">
        <a class="site-brand" href="index.html" aria-label="${site.brand.name} home">
          <img class="site-logo" src="${site.brand.logo}" alt="" decoding="async" width="78" height="68">
          <span class="site-brand__name">${site.brand.name}</span>
        </a>
        <button class="site-nav__toggle" type="button" aria-expanded="false" aria-label="Open menu">☰</button>
        <nav class="site-nav__links" aria-label="Main navigation">
          ${site.navigation.map(item => buildLink(item, currentPage)).join("")}
        </nav>
      </div>
    </header>`;

  const header = host.querySelector(".site-header");
  const toggle = host.querySelector(".site-nav__toggle");
  const links = host.querySelector(".site-nav__links");

  const updateHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.textContent = open ? "×" : "☰";
  });
}
