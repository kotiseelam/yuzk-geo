# PROJECT PROMPT — Yuzk Discover (iOS app)

Copy everything below this line into your coding agent to start the project.

---

## Role & goal

You are building **Yuzk Discover**, the first product of the **Yuzk** brand: a mobile app that shows the user one beautiful photo from around the world each day — a city, building, bridge, wonder, or natural place — together with the real story behind it. The marquee feature is an **iPhone lock screen widget** showing today's place.

A working **web design spec exists**: `discover.html`. Replicate its design language: dark theme (#07070b background), Space Grotesk display font, purple→teal→pink gradient accents (#7c5cff / #00e0c6 / #ff5ca8), rounded 18px cards, a photo card with kicker badge (e.g. "BRIDGE"), big title, 📍 location line, story paragraph, and a button row.

Stack decisions are already made — **do not revisit them**:
- **Expo SDK 56**, React Native 0.8x, TypeScript
- **`expo-widgets`** (stable in SDK 56) for the lock screen widget
- **Expo dev build / EAS**, not Expo Go
- Data: **Wikipedia REST API** (free, CORS-open, no key): `https://en.wikipedia.org/api/rest_v1/page/summary/{title}`
- Developer works **on Windows**; iOS builds go through **EAS Build** cloud runners

## Scope (v1 — must ship)

1. **App tab (default screen):**
   - Photo card matching the web spec
   - "🎲 Next Place" button loads a new random landmark
   - "🔒 Set Lock Screen" — saves the photo to the app group container / shared storage and shows a one-time setup guide (see Shortcuts section)
2. **Data:**
   - Curated pool of at least 50 world places (city / building / bridge / wonder / nature), each record: `{ title (Wikipedia article title), kicker, placeName }`
   - Fetch title, thumbnail (highest thumb resolution reasonable for wallpaper: ≥1080px if available via Commons/original URL), and extract from the API
   - Graceful loading (skeleton), error, and retry states
   - Log which article + license applies (helper module for attribution)
3. **Lock screen widget (expo-widgets):**
   - Families: `accessoryRectangular` (primary), plus `accessoryCircular` (small Y monogram + place emoji)
   - Content: small thumbnail, place name, one-line fact, "Yuzk · Today's Discover" label
   - Widget gets its data from shared storage (app group), updated when the user taps Set Lock Screen or on a daily timeline provider
   - Widget code runs in an isolated runtime — no hooks/app state/async work inside; pass data in
4. **Shortcuts setup flow (in-app):**
   - A screen explaining, honestly, that iOS requires one-time setup: "Post daily wallpaper via Shortcuts automation" with numbered steps and a button that opens the Shortcuts app via a universal-link/deep-link
   - Never claim "automatic wallpaper" in UI copy — reviewers reject that
5. **Polish:**
   - A simple About screen: the Yuzk brand story ("in progress", day one), credits: photos & info via Wikipedia/Wikimedia
   - Dark mode only (v1)
   - App icon should be the Yuzk Y monogram on conic-gradient (purple/teal/pink)

## Guardian / review constraints (from App Store rules)

- Wikipedia/Wikimedia images: fetch each file's `License` / `Artist` data and show attribution on the place detail screen; review each file's license dynamically (do not hardcode claims that "all Wikipedia is CC")
- Privacy policy URL + support email required — use placeholders `https://yuzk.app/privacy` and `hello@yuzk.com` for now
- No accounts in v1 (avoids the in-app account-deletion requirement)
- The app must be a usable value-adding app, not a thin web wrapper

## Non-goals (v2+ — do NOT build)

- Android (later — the same codebase will work via EAS)
- User accounts / saved favorites / premium
- AI descriptions, audio, ads

## Acceptance criteria for the agent

- `npx expo start` runs the app with feed + About and a random-place fetch succeeding
- `npx expo prebuild` produces a project with a working `expo-widgets` lock screen widget target
- `eas submit` path documented (doesn't need real Apple creds during development)
- Every place fetch statistically avoids repeating the last one (random-pick excluding current index)
- Typecheck passes (`npx tsc --noEmit`), and there is no undefined behavior or mock data — everything fetches live from the API
- Code is clean, commented, and file-organized: `app/` (screens), `components/` (Card, Controls, Skeleton), `lib/` (places pool, wiki API, attribution), `widget/` (expo-widgets code)

## Build order for the agent

1. Scaffold with `npx create-expo-app@latest` (TypeScript template)
2. Build the place-data layer + feed card UI first (matches web spec)
3. Wire Set-Lock Screen + attribution display
4. Add the expo-widgets lock screen widget (dev build)
5. Add the About screen + shortcuts setup screen
6. Sketch out the EAS/eas.json specifics, README with Windows-from-scratch run instructions

Also copy the **web prototype HTML** as reference inside the repo under `design/` so the agent can see the design spec visually.

---

*Prompt ends here — the file below is reference material, not part of the prompt.*

**Reference web prototype:** `discover.html` in this repo (live design spec).
**Verified sources (2026):** Expo widgets docs / EAS pricing / Apple requirements — see chat history for links.
