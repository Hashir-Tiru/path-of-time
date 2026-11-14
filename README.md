# KALA CHAKRA PWA — v20

This package contains the latest KALA CHAKRA Mobile v20 HTML as the installable PWA.

## Publish/update

1. Extract this ZIP.
2. Upload the *contents* of this folder to the root of the existing `path-of-time` GitHub repository.
3. Replace the existing `index.html`, `manifest.webmanifest`, `sw.js`, and `icons/` files.
4. Commit the changes and wait for GitHub Pages to publish.
5. Open the site over HTTPS and refresh. If an older installed copy remains visible, close it and reopen after the service worker updates.

## Package contents

- `index.html` — exact copy of KALA CHAKRA Mobile v20
- `manifest.webmanifest` — installable app metadata
- `sw.js` — app-shell and offline caching, cache version v20
- `icons/` — KALA CHAKRA app icons

Personal records remain in browser storage for that browser and device. There is no cloud synchronisation or user-facing export/import feature. Records stored under a different origin or local-file context do not automatically transfer.

The service worker requires HTTPS (or localhost). Offline operation depends on the app shell and any previously cached external dependencies; this package has not been browser/device tested here.
