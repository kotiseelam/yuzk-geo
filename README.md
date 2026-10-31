# Yuzk Geo — Discover the World

Discover the world one place at a time, and learn geography as you go.

- **Discover** 🌐 — a real photo of a place from around the world with its true story, straight from Wikipedia
- **Quiz** 🧠 — "Where is this?" country-guessing game with a 🔥 daily streak
- **Live discovery** 🌍 — beyond the 141 curated landmarks, the app searches geotagged Wikipedia articles near real coordinates every minute, so the feed keeps growing toward millions of places with no backend

## Run it

Open `geo.html` in any browser. That's it — one file, no build, no API keys. Data is fetched live from `en.wikipedia.org` (CORS-open, keyless).

## Chrome extension

See [extension/README.md](extension/README.md) — every new tab becomes a geography lesson.

## Repo map

| Path | What it is |
|---|---|
| `geo.html` | Yuzk Geo web app (Discover + Quiz + streak + live discovery) |
| `discover.html` | Yuzk Discover concept — photo feed + iPhone lock-screen mock |
| `extension/` | Chrome/Edge extension (Manifest V3, new-tab override) |
| `index.html` | Early Yuzk Discover landing concept |

## Data & credits

Photos & info © Wikipedia/Wikimedia contributors — fetch live at runtime; see each article for its license. App code was vibe-coded with Codebuff.
