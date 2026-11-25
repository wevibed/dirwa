# Performance pass

**Loading**
- three.js (~half the JS) and the 3D showroom are now lazy chunks. The gallery and first paint no longer wait for them.
- The showroom chunk is pre-warmed when the browser is idle (skipped for gallery-first visits and Data Saver).
- The 3D concept preview loads only when "3D concept" is tapped.
- Google Fonts no longer block first paint (preload + swap); dark background is inlined to avoid a white flash.
- `public/_headers` gives images, models and JS a 1-year immutable cache (Cloudflare Pages).

**Images**
- New sizes generated from the originals: `products/thumbs/sm/` (360 px) and `products/md/` (800 px).
- Gallery cards use `srcset`: phones fetch 360 px (1.36 MB for all 90, was 3.76 MB at 640 px).
- Product detail uses 800 px on phones, full size only when needed.
- First 6 cards load eagerly with high priority, the rest lazily. Cards have fixed dimensions (no layout shift).
- `content-visibility: auto` on cards so off-screen ones cost nothing while scrolling.

**Showroom**
- GLB models load 1-2 at a time (1 on phones), entrance room first, after the first frame paints.
- Idle fly-through is capped to 30 fps on phones; pixel ratio max 1.5 on phones.
- Backdrop blur over the WebGL canvas is replaced with near-opaque colour on small screens.

Not verified here: `npm install` / `npm run build` (no network in the editing environment). Source files were syntax-checked and all 90 x 4 image variants confirmed present.

## Second pass

- **Models load per room.** On phones (or Data Saver) only the bedroom's models download while the welcome screen
  shows; the living and dining rooms download when the visitor enters the showroom, flies to a room or opens
  a piece there (that room first). Phones skip roughly two thirds of the ~9 MB on the first visit. Desktops still load everything.
- **Service worker (`public/sw.js`)**: after the first visit, scripts, photos, models and the 3D decoder come from
  the device cache, so repeat visits are near-instant and the gallery still works on a weak signal.
  Images and models refresh quietly in the background. Bump `VERSION` in sw.js to force a full refresh.
- Found, not changed: the 8 larger 3D models have 120k-260k vertices each (about 1.5M in total). Reducing that
  needs a mesh-decimation tool and a visual check of each model; it is the biggest remaining cost on low-end phones.
