# DIRWA showroom image integration

## What changed

- Added eight prepared product image assets under `public/products/` (seven distinct images; the dining-table and dining-chair listings share one dining-set image).
- Mapped the selected images to the eight products already placed in the 3D showroom.
- Added in-world framed photo displays above/near each corresponding product location. Each photo surface carries the same product ID as its existing 3D model and hotspot, so tapping/clicking the photo opens the existing product detail flow.
- Kept the original procedural furniture meshes, room shell, lighting, camera movement, room transitions, floor-tap navigation, hotspots, product dock, gallery, details panel, and WhatsApp enquiry flow.
- Product cards and detail panels continue to use the same mapped product photos.

## Product mapping

| Existing showroom listing | Image |
| --- | --- |
| Recliner sofa | `recliner-sofa.webp` |
| Kirst sofa | `kirst-sofa.webp` |
| L-shape sofa | `l-shape-sofa.webp` |
| Storage bed | `storage-bed.webp` |
| 6-door wardrobe | `wardrobe-6-door.webp` |
| 3-piece kitchen unit | `kitchen-3-piece.webp` |
| Dining table | `dining-set.webp` |
| Dining chairs | `dining-set.webp` |

`purple-gold-bed-alternative.webp` is retained as an additional prepared image but is not assigned to a different existing product listing.

## Important visual limitation

The supplied visuals are complete room/product photographs, not transparent isolated furniture cutouts or 3D models. They are displayed as framed in-world photo panels; the existing 3D furniture meshes remain as spatial placeholders. This avoids pretending a flat full-background photograph is a 3D furniture object. Replacing the placeholders with accurate 3D furniture requires approved isolated cutouts or real GLB models.

## Validation

- `node --check` passed for the modified showroom scene and product data modules.
- All eight product image files were confirmed present and readable.
- A Vite production build could not be completed in this environment: the Vite executable is absent from the mounted dependencies and `npm ci` timed out while attempting package installation. Run `npm ci` then `npm run build` locally before deployment.
