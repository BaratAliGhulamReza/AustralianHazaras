import { renderCensusPanels, renderBenefits } from "../components/census.js";
import { setText } from "../utils/shared.js";
import { bootstrapPage } from "../utils/page-bootstrap.js";
import { setResponsiveBanner } from "../utils/responsive-image.js";

bootstrapPage({
  currentPage: "census",
  data: {
    site: "content/site.json",
    census: "content/census.json",
  },
  render: ({ census }) => {
    const page = census.page;
    const labels = {
      "census-eyebrow": page.eyebrow,
      "census-title": page.title,
      "census-tagline": page.tagline,
      "census-description": page.description,
      "census-button": `${page.buttonLabel} →`,
      "numbers-eyebrow": page.sectionEyebrow,
      "numbers-heading": page.sectionHeading,
      "numbers-description": page.sectionDescription,
      "why-eyebrow": page.whyEyebrow,
      "why-heading": page.whyHeading,
      "why-description": page.whyDescription,
    };
    Object.entries(labels).forEach(([id, value]) => setText(id, value));
    setResponsiveBanner(document.getElementById("census-banner"), page.banner, "Sydney Harbour at sunset");
    renderCensusPanels(document.getElementById("census-panels"), census.national);
    renderBenefits(document.getElementById("benefit-grid"), census.benefits);
  },
});
