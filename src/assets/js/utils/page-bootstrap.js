import { loadWebsiteData } from "../services/data-service.js";
import { renderSiteShell } from "../components/site-shell.js";
import { showPageError } from "./page-error.js";

export async function bootstrapPage({ currentPage, data, render }) {
  try {
    const loaded = await loadWebsiteData(data);
    renderSiteShell(loaded.site, currentPage);
    await render(loaded);
  } catch (error) {
    showPageError(error);
  }
}
