import { renderSiteHeader } from "./site-header.js";
import { renderSiteFooter } from "./site-footer.js";

export function renderSiteShell(site, currentPage) {
  renderSiteHeader(document.getElementById("site-header"), site, currentPage);
  renderSiteFooter(document.getElementById("site-footer"), site);
}
