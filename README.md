# Australian Hazaras Website

This repository contains only the public website source, build tools, schemas, tests, and GitHub Actions deployment files.

## Structure

- `src/content/` — editable website content
- `src/content/articles/` — one JSON file per post
- `src/assets/` — modular CSS, JavaScript, and images
- `src/templates/` — page and shared templates
- `schemas/` — JSON validation schemas
- `tools/` — build, validation, image, and Census automation
- `tests/` — automated checks
- `.github/` — GitHub Pages deployment and validation workflows

Generated output is written to `dist/` and is not committed.

## Commands

```bash
pip install -e ".[dev]"
python tools/site.py build
python tools/site.py validate
python tools/site.py test
python tools/site.py serve
```

## Article image standard

Featured article images use a consistent 16:9 crop. Use a source image at least 1200 pixels wide; 1600 × 900 pixels or larger is preferred. The Content Manager creates responsive WebP variants automatically.
