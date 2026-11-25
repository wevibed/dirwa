
import { GALLERY_PRODUCTS } from './galleryProducts.js';

const G = Object.fromEntries(GALLERY_PRODUCTS.map((p) => [p.id, p]));

const NOTE =
  "A real Dirwa piece, shown here as a 3D model built from the client's own photo. Contact Dirwa to confirm the exact size, finish and availability.";

const RAW = [
  // Living room
  {
    id: 'sitting-room-set',
    name: 'Sitting Room Set',
    category: 'living',
    gallery: 'dirwa-sofa-03',
    room: 'living',
    price: 500,
    pos: [-10.5, -3.3],
    ry: 0,
    sh: [4.5, 3.2],
    dist: 4.5,
    ly: 0.8,
    hy: 1.6,
    zUp: false,
  },
  {
    id: 'u-shaped-sofa',
    name: 'U-Shaped Sofa',
    category: 'living',
    gallery: 'dirwa-sofa-10',
    room: 'living',
    price: 420,
    pos: [-13.0, 1.5],
    ry: Math.PI / 2,
    sh: [3.5, 4.0],
    dist: 4.6,
    ly: 0.8,
    hy: 1.7,
    zUp: false,
  },

  // Bedroom
  {
    id: 'six-door-wardrobe',
    name: 'Six Door Wardrobe',
    category: 'wardrobes',
    gallery: 'dirwa-wardrobe-01',
    room: 'bedroom',
    price: 450,
    pos: [-3.1, -4.14],
    ry: 0,
    sh: [3.6, 1.2],
    dist: 3.8,
    ly: 1.2,
    hy: 2.5,
    zUp: false,
  },
  {
    id: 'tufted-purple-trim-bed',
    name: 'Tufted Bed with Purple Trim',
    category: 'headboards',
    gallery: 'dirwa-headboard-08',
    room: 'bedroom',
    pos: [0, -3.27],
    ry: 0,
    sh: [3.1, 3.0],
    dist: 4.4,
    ly: 0.8,
    hy: 1.95,
    zUp: false,
  },
  {
    id: 'lift-up-storage-bed',
    name: 'Lift Up Storage Bed',
    category: 'bedroom',
    gallery: 'dirwa-bed-07',
    room: 'bedroom',
    pos: [2.9, -3.32],
    ry: 0,
    sh: [2.3, 2.9],
    dist: 4.2,
    ly: 0.8,
    hy: 1.8,
    zUp: false,
  },
  {
    id: 'tufted-bed',
    name: 'Tufted Bed',
    category: 'bedroom',
    gallery: 'dirwa-bed-01',
    room: 'bedroom',
    price: 850,
    pos: [0, 1.2],
    ry: 0,
    sh: [3.1, 3.0],
    dist: 4.4,
    ly: 0.8,
    hy: 1.95,
    zUp: false,
  },

  // Dining and kitchen
  {
    id: 'dining-chairs',
    name: 'Dining Chairs',
    category: 'dining',
    gallery: 'dirwa-dining-01',
    room: 'dining',
    price: 850,
    pos: [9.0, -1.7],
    ry: Math.PI / 2,
    sh: [2.5, 3.7],
    dist: 3.9,
    ly: 0.6,
    hy: 1.5,
    zUp: false,
  },
  {
    id: 'kitchen-unit',
    name: 'Kitchen Unit',
    category: 'kitchen',
    gallery: 'dirwa-kitchen-01',
    room: 'dining',
    price: 650,
    pos: [12.2, -4.18],
    ry: 0,
    sh: [3.4, 1.2],
    dist: 4.2,
    ly: 1.1,
    hy: 2.35,
    zUp: false,
    tune: (m) => {
      m.color.multiplyScalar(0.82);
      m.metalness = 0;
      m.roughness = 0.82;
    },
  },
];

const LABEL = {
  living: 'Living Room',
  bedroom: 'Bedroom',
  wardrobes: 'Wardrobes',
  kitchen: 'Kitchen',
  dining: 'Dining',
  media: 'TV & Media',
  headboards: 'Headboards',
};

export const SHOWROOM_PIECES = RAW.map((r) => {
  const g = G[r.gallery] || {};
  const { id, name, category, gallery, room, price, ...cfg } = r;

  return {
    id,
    name,
    category,
    categoryLabel: LABEL[category],
    price: price ?? null,
    model: 'glb',
    params: {},
    glb: `/models/${id}.glb`,
    gallery,
    photo: g.photo || null,
    reference: g.reference || null,
    description: NOTE,
    details: [],
    showroom: { room, ...cfg },
  };
});
