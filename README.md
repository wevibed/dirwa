# DIRWA FURNITURE — WEBSITE RELEASE CANDIDATE

React + Vite + Three.js website for Dirwa Furniture, Highglen Shops, Harare.

## Included

- Premium charcoal, ivory and brass visual design.
- Responsive homepage, product gallery and 3D showroom navigation.
- 90 gallery photographs organised across living room, bedroom, headboards, wardrobes,
  kitchen, dining and TV/media categories.
- Product detail panel with photo view, category-level 3D concept preview and WhatsApp enquiry.
- Dedicated procedural WA0008 cream L-shaped sofa model in the showroom and 3D preview.
- Mobile-oriented rendering profile, reduced texture sizes, frame pause while tab is hidden,
  improved renderer fallback attempts and a photo-based showroom fallback.
- WhatsApp enquiry number configured as +263 71 802 2928.
- Prices hidden pending confirmation from Dirwa.

## Run locally

```bash
npm install
npm run dev
```

Create and test the production bundle:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: project root

## 3D showroom: the client's real products

The walk-through showroom keeps its house-style rooms (rugs, art, plants, lamps, windows, pendant
lights) and now stands the client's real products in them as 3D models, not generic drawings:

- Living room: grey L-shaped sectional, cream modular sectional, charcoal leather living room set,
  wood slatted TV wall unit
- Bedroom: white mirror wardrobe, tufted bed with purple trim, lift-up storage bed
- Dining and kitchen: black dining table with chrome chairs, cream display kitchen cabinet

Tap a piece (or its card in the strip) to fly up to it. The panel shows the client photo the model is
based on, plus the Enquire on WhatsApp button. In the gallery, the matching photos get a
"See it in the showroom" link. The gallery itself is unchanged.

How it works
- The models are in `public/models/*.glb` (cleaned copies of the supplied files: meshes merged by
  material so phones draw far fewer objects).
- `src/data/showroomPieces.js` says which model goes where, which client photo it is based on,
  and where the camera stands. To move or add a piece, edit that list and run `npm run check`.
- `src/showroom/glb.js` stands each model upright, puts it on the floor and fixes its materials. The
  supplied files store ordinary screen colours in linear fields, so everything looked washed out and
  every material was flagged fully metallic (fabric and wood went black). Colours are converted and
  each material gets a proper finish; chrome and brass keep a soft reflection.
- A per-piece `tune` function can adjust colours, for example the cream and grey sofas.
- Tapping a piece frames the whole product at a clean angle in the part of the screen the product
  sheet leaves free (phones: 3D view on top, sheet below; desktop: sheet on the right). The camera
  avoids standing inside other furniture. Each piece stands on a display podium with a price placard.
- Clean views: when a product is open, every other product fades to a faint ghost (focus mode), so
  nothing can block it, and they come back when you close the sheet or walk away. The camera also runs a
  line-of-sight check from each candidate angle and picks one with a clear view of the product.
- Smooth shading: `src/showroom/glb.js` rebuilds the shading of the supplied models (they were faceted)
  so rounded parts look smooth and sharp edges stay crisp. The crease angle (40 degrees) is in
  `smoothGeometry`.
- Prices: add `price: 350` (or `[300, 400]`) to a piece in `src/data/showroomPieces.js`. Pieces without a
  price show "Price on request". Set `SHOW_PRICES = false` in `src/config.js` to hide every price.
  Only the cream modular sofa has a price so far (from the WhatsApp catalogue); confirm it with Dirwa.
- Tap the small real photo in the product sheet to open it full screen.
- One-file preview: `npm run preview:file` writes `dirwa-showroom-preview.html`, a single file with the
  models and photo thumbnails embedded, for sending to the client.

The product gallery still offers an optional category-level 3D concept preview; those are not exact
models of each photographed item.

## Launch items to confirm before publishing

1. Final image cleanup: eight images have first-pass cleaned versions; other photos may still
   have catalogue numbers or overlays. Replace them with clean originals or complete retouching.
2. Confirm official product names, reference numbers, prices, dimensions, material/finish and stock.
3. Confirm delivery coverage, payment terms and the public contact/address details.
4. Confirm the WhatsApp number +263 71 802 2928 remains the preferred enquiry number.
5. Test the production build on target Android phones and iPhone Safari, plus desktop browsers.

This package is a deployable technical candidate, but the content checks above should be
completed before describing it as the final client-approved production release.


## Business contact details (from Dirwa's supplied business-profile screenshot)

- Main WhatsApp / phone: +263 71 802 2928
- EcoCash contact: +263 78 308 9538
- Email: munashedirwa0@gmail.com
- Address: 10251 Willowvale Road, Harare, Zimbabwe
- Landmark description: Highglen Road and Willowvale Road, opposite Kidcamp
- The profile lists the business as open 24 hours; the site labels this as listing information, not verified staffed opening hours.
- The business profile describes video-call sales and local pay-on-delivery; delivery coverage and EcoCash payment terms should be confirmed before publishing stronger promises.


## Compatibility and 3D scope

The 3D showroom uses Three.js with mobile-conscious pixel ratio and shadow settings, a photo/category fallback when the full showroom renderer cannot start, and an automatic product-photo fallback if a product 3D preview loses its WebGL context. The WA0008 L-shaped sofa is a procedural first-pass reconstruction from its supplied photo. The remaining product 3D previews are category-level illustrative models, not individually modelled exact replicas of all photographed SKUs. This package is a deployment candidate pending a successful local production build and real-device browser testing.
