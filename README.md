# Nice Return Visits website

Public website for Nice Return Visits (NRV), hosted at nicereturnvisits.org.
The installable app is in the separate
[nice-return-visits-app](https://github.com/grasfulls/nice-return-visits-app)
repository and is live at https://grasfulls.github.io/nice-return-visits-app/.

## Layout

| Path | Purpose |
|---|---|
| `index.html`, `getting-started.html`, `help.html`, `faq.html`, `contact.html`, `privacy.html`, `terms.html`, `version-history.html` | English pages |
| `es/` | Spanish pages (same file names as the English pages) |
| `assets/css/styles.css` | Shared stylesheet |
| `assets/js/language-menu.js` | Header Language dropdown behavior |
| `assets/` (images, SVGs) | Icons, header watermark, background, install illustrations |

The icons and watermark in `assets/` are this site's own copies of the app's
files in `icons/` in the app repository. The app's copies are the reference
versions.

The Home, Getting Started, and Help pages are the public documentation; the
help inside the app is the app repository's `help.html`.

## Previewing locally

From this folder, run `python -m http.server 8766` and open
http://localhost:8766/.

## Maintenance notes

- Each page repeats the same header and footer; update all pages (including
  `es/`) when changing them.
- Keep English and Spanish pages in step.
- Version history entries are generated from `release-history.json` in the
  app repository. Follow its documented approval and release procedure; run
  `node scripts/release-history.js --write --site <website-directory>` from
  that repository, then use `--check` with the same site path. Do not edit the
  generated history entries separately.
