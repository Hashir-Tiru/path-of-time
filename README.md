# KALA CHAKRA — PWA Base v2

This is the installable PWA build based on the approved Normal Mobile Data Layer v2.

## Package contents
- `index.html` — approved app with shared personal-data layer and Death Moment age display
- `manifest.webmanifest` — install metadata
- `sw.js` — versioned offline app-shell cache and pinned Astronomy Engine cache
- `icons/` — 192px and 512px icons

## Important: preserve your existing Birth/Death Moment data
Local HTML file storage (`file://`) and the hosted PWA (`https://`) are separate browser storage origins. Your previously saved Birth Moment and Death Moment will NOT automatically appear in the hosted PWA.

Before switching:
1. Open your currently working mobile HTML.
2. Use **Personal Data → Export backup**.
3. Keep the downloaded `kala-chakra-personal-backup.json`.

After publishing this package over HTTPS:
1. Open the hosted KALA CHAKRA page.
2. Use **Personal Data → Import backup** and select that JSON file.
3. Confirm Birth Moment, Death Moment, Energy Weather Jupiter/Saturn and Death Moment Jupiter/Saturn readings.
4. Install the app from the browser.

## Android installation
Publish the ZIP contents to the root of an HTTPS site (GitHub Pages is suitable). Open the URL in Chrome and choose Install app / Add to Home screen.

## iPhone / iPad installation
Publish to HTTPS. Open the URL in Safari, tap Share → Add to Home Screen → Add.

## Offline test
Open the hosted page once while online and wait for it to finish loading. Then enable airplane mode and reopen the installed app. The app shell and the pinned Astronomy Engine dependency should be available offline after they have been cached successfully.

## Release discipline
Cache name: `kala-chakra-pwa-v2`. Increment the cache version for future releases. Keep this ZIP as the PWA Base v2 reference.
