// Responsive image helpers. Every product photo exists in four sizes:
//   /products/thumbs/sm/  360 px   gallery cards on phones
//   /products/thumbs/     640 px   gallery cards on tablets / desktop
//   /products/md/         800 px   product detail view on phones and small screens
//   /products/            full     lightbox / large screens
const swap = (photo, dir) => photo.replace('/products/', dir);

export const cardImage = (photo) => ({
  src: swap(photo, '/products/thumbs/sm/'),
  srcSet: `${swap(photo, '/products/thumbs/sm/')} 360w, ${swap(photo, '/products/thumbs/')} 640w`,
});

export const detailImage = (photo) => ({
  src: swap(photo, '/products/md/'),
  srcSet: `${swap(photo, '/products/md/')} 800w, ${photo} 1280w`,
});
