export function renderSiteFooter(host, site) {
  host.innerHTML = `
    <footer class="site-footer">
      <div class="container site-footer__layout">
        <a class="site-footer__brand" href="index.html" aria-label="${site.brand.name} home">
          <span class="site-footer__name">${site.brand.name}</span>
          <img class="site-footer__logo" src="${site.brand.logo}" alt="" decoding="async" width="34" height="34">
        </a>
      </div>
    </footer>`;
}
