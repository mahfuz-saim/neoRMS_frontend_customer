import React from 'react';
import { ShoppingCart, ImageOff } from 'lucide-react';

const T = {
  primary: '#2DBE60',
  dark:    '#1F2937',
  muted:   '#6B7280',
  border:  '#E5E7EB',
};

const FoodCard = ({ item, onClick }) => {
  /* Support both direct price and variants array */
  const displayPrice = (() => {
    if (Array.isArray(item.variants) && item.variants.length > 0) {
      const prices = item.variants.map((v) => Number(v.price ?? 0));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return min === max ? `$${min.toFixed(2)}` : `From $${min.toFixed(2)}`;
    }
    return `$${Number(item.price ?? 0).toFixed(2)}`;
  })();

  /* Support images array or single image */
  const thumbnail = (Array.isArray(item.images) && item.images[0])
    ? item.images[0]
    : item.image ?? '';

  return (
  <article
    onClick={() => onClick(item)}
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick(item)}
    role="button"
    aria-label={`View details for ${item.name}`}
    className="popular-card bg-white rounded-xl cursor-pointer flex flex-col w-full"
    style={{
      border: `1px solid ${T.border}`,
      boxShadow: '0 2px 12px rgba(31,41,55,0.07)',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      outline: 'none',
      padding: 12,
      opacity: item.isAvailable === false ? 0.6 : 1,
    }}
  >
    {/* Image */}
    <div
      className="relative overflow-hidden"
      style={{ aspectRatio: '1/1', borderRadius: 10, marginBottom: 12, background: '#F3F4F6' }}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={item.name}
          loading="lazy"
          crossOrigin="anonymous"
          className="popular-card-img w-full h-full object-cover block"
          style={{ transition: 'transform 0.4s ease-in-out' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextSibling && (e.currentTarget.nextSibling.style.display = 'flex');
          }}
        />
      ) : null}
      <div
        style={{
          width: '100%', height: '100%',
          display: thumbnail ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <ImageOff size={32} color="#D1D5DB" />
      </div>
      {item.badge && (
        <span
          className="absolute top-2 left-2"
          style={{
            backgroundColor: 'rgba(45,190,96,0.90)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.6px',
            textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
          }}
        >
          {item.badge}
        </span>
      )}
      {item.isAvailable === false && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', background: '#FEF2F2', padding: '3px 10px', borderRadius: 4 }}>Unavailable</span>
        </div>
      )}
    </div>

    {/* Content */}
    <div style={{ padding: '0 4px 4px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <h3
        style={{
          fontSize: 14, fontWeight: 600, color: T.dark,
          lineHeight: 1.45, marginBottom: 10,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}
      >
        {item.name}
      </h3>

      <div className="flex items-center justify-between">
        <span style={{ fontSize: 16, fontWeight: 700, color: T.primary }}>
          {displayPrice}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(item); }}
          disabled={item.isAvailable === false}
          aria-label={`Add ${item.name} to cart`}
          style={{
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: 'rgba(45,190,96,0.10)',
            border: 'none', cursor: item.isAvailable === false ? 'not-allowed' : 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.primary,
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(45,190,96,0.22)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(45,190,96,0.10)'; }}
        >
          <ShoppingCart size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  </article>
  );
};

export default FoodCard;
