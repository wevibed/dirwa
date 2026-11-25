# DIRWA showroom image integration — first pass

## Included
- Optimized WebP product visuals in `public/products/`.
- Product photo mapping in `src/data/products.js`.
- Product cards now use the mapped photos through the existing `useThumb()` hook.
- Product details panel displays the product photo in both showroom and gallery views.
- Added the missing L-shape sofa to the showroom placement map so the three living-room products can appear in the room dock.

## Current product mapping
- Recliner sofa → `recliner-sofa.webp` (white sofa set reference)
- Kirst sofa → `kirst-sofa.webp` (charcoal sectional reference)
- L-shape sofa → `l-shape-sofa.webp` (grey sectional reference)
- Storage bed → `storage-bed.webp` (beige lift-up storage bed reference)
- 6-door wardrobe → `wardrobe-6-door.webp`
- 3-piece kitchen → `kitchen-3-piece.webp`
- Table and dining chairs → shared dining-set photograph

`purple-gold-bed-alternative.webp` is included as an unassigned alternate bed visual. It is not silently assigned to the existing storage-bed listing because it is a different design and does not show the lift-up storage feature.

## Important limitation in this pass
The product photos supplied/generated for this workflow are room-scene images, not transparent furniture cutouts. They are wired into cards and product detail panels, but the Three.js scene still uses its procedural furniture meshes as temporary in-room placeholders. This avoids placing full rectangular room photographs into the 3D scene, which would look like floating posters rather than furniture.

Next pass: create/approve isolated transparent product cutouts (or real GLBs) and replace each placeholder mesh with the corresponding asset. Keep the existing room shell, navigation, camera, pick markers, gallery and WhatsApp flows.

## Build
Run `npm install`, then `npm run build`.
