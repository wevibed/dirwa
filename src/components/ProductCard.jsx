import { memo } from 'react';
import { SHOW_PRICES } from '../config.js';
import { formatPrice } from '../lib/format.js';
import { cardImage } from '../lib/img.js';
import useThumb from './useThumb.js';

// `priority` marks the first few visible cards: they load eagerly so the top of the gallery
// paints fast; everything further down loads lazily as it scrolls near.
function ProductCard({ product, onOpen, compact = false, priority = false }) {
  const full = useThumb(product, { thumbnail: true });
  const ri = product.photo ? cardImage(product.photo) : null;
  return (
    <button type="button" className={'card' + (compact ? ' compact' : '')} onClick={() => onOpen(product.id)}>
      <span className="ph">
        {full && (
          <img
            src={ri ? ri.src : full}
            srcSet={ri ? ri.srcSet : undefined}
            sizes={ri ? (compact ? '156px' : '(max-width: 820px) 50vw, 230px') : undefined}
            alt=""
            width="360"
            height="270"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'low'}
          />
        )}
      </span>
      <span className="tx">
        <span className="nm">{product.name}</span>
        <span className="ct">
          {product.categoryLabel}
          {SHOW_PRICES && product.price != null && <span className="pr">{formatPrice(product.price)}</span>}
        </span>
      </span>
    </button>
  );
}

export default memo(ProductCard);
