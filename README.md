# Australian Hazaras website

A clean, source-driven static website for GitHub Pages. All editable content, templates, styles, scripts and images live in `src/`. The public website is generated into `dist/`.

## Architecture

```text
src/
├── content/                 Structured site, city, category, Census and article data
│   └── articles/            One JSON file per article
├── templates/
│   ├── partials/            Shared header and footer
│   └── pages/               Page templates
└── assets/                  CSS, JavaScript and images
schemas/                     JSON Schema definitions
tools/                       Build, validation, image and Census automation
tests/                       Automated content and build tests
dist/                        Generated deployable website
.github/workflows/           Validation, deployment and Census automation
```

## Commands

```bash
pip install -e ".[dev]"
python tools/site.py build
python tools/site.py validate
python tools/site.py test
python tools/site.py serve
python tools/site.py release
```

`release` performs a clean build, validation and tests, then generates the SHA-256 manifest and validation report inside `dist/`.

## Editing content

- Shared branding and navigation: `src/content/site.json`
- Cities: `src/content/cities.json`
- Categories: `src/content/categories.json`
- Census content: `src/content/census.json`
- Articles: add one JSON file to `src/content/articles/`
- Shared layout: `src/templates/partials/`
- Page structure: `src/templates/pages/`

Do not manually edit or commit files in `dist/`; the directory is generated locally and during GitHub Pages deployment.

## Responsive banner generation

```bash
python tools/images.py path/to/original.jpg melbourne
```

This creates 640, 1024 and 1600 pixel WebP variants in the banner directory.

## Census automation

The Census updater accepts only HTTPS URLs from approved ABS hosts. It changes source content only when validated official figures differ from the current values. The scheduled GitHub workflow opens a pull request instead of pushing directly to `main`.

## Deployment

GitHub Actions builds and validates the website, then deploys only `dist/` to GitHub Pages.
