import { useEffect, useState } from 'react';

// Product cards use small WebP derivatives. Opened product details use the
// original photograph so customers can inspect the full-resolution image.
export default function useThumb(product, { thumbnail = false } = {}) {
  const photo = product?.photo
    ? (thumbnail ? product.photo.replace('/products/', '/products/thumbs/') : product.photo)
    : null;
  const [modelUrl, setModelUrl] = useState(null);

  useEffect(() => {
    if (photo || !product) return undefined;
    let live = true;
    setModelUrl(null);
    // three.js is only needed for products without a photo, so it is loaded on demand
    import('../showroom/thumbs.js')
      .then((m) => m.requestThumb(product))
      .then((url) => {
        if (live && url) setModelUrl(url);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [product?.id, photo]);

  return photo || modelUrl;
}
