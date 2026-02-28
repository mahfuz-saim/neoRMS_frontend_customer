import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const T = {
  primary:     '#2DBE60',
  primaryDark: '#22A455',
  dark:        '#1F2937',
  muted:       '#6B7280',
  border:      '#E5E7EB',
  cardBg:      '#FFFFFF',
  badgeBg:     'rgba(45,190,96,0.12)',
};

const Stars = ({ rating }) => (
  <span className="flex items-center gap-1">
    <Star size={13} fill={T.primary} color={T.primary} />
    <span style={{ fontSize: 12, fontWeight: 600, color: T.dark }}>{rating}</span>
  </span>
);

const FoodModal = ({ item, onClose, restaurantId = null }) => {
  const images   = item.images?.length ? item.images : (item.image ? [item.image] : []);
  const variants = Array.isArray(item.variants) ? item.variants : [];
  const addonOptions = Array.isArray(item.addons) ? item.addons : [];

  const [visible,         setVisible        ] = useState(false);
  const [added,           setAdded          ] = useState(false);
  const [imgIdx,          setImgIdx         ] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(variants[0] ?? null);
  const [selectedAddons,  setSelectedAddons ] = useState([]);

  const computedPrice = selectedVariant
    ? Number(selectedVariant.price ?? 0)
    : item.price ?? 0;

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 260);
  }, [onClose]);

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [handleClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon]
    );
  };

  const handleAddToCart = () => {
    if (added) return;
    addToCart(
      {
        id:       item.id ?? item._id,
        name:     item.name,
        price:    computedPrice,
        image:    images[0] ?? '',
        category: item.category ?? '',
        // Read variant label in priority order matching the normalise mapping
        variant:  selectedVariant?.size ?? selectedVariant?.name ?? selectedVariant?.type ?? null,
        addons:   selectedAddons,
      },
      restaurantId,
    );
    setAdded(true);
    setTimeout(handleClose, 900);
  };

  const handleViewCart = () => {
    handleClose();
    const cartPath = restaurantId ? `/restaurant/${restaurantId}/cart` : '/cart';
    setTimeout(() => navigate(cartPath), 270);
  };

  return (
    <>
      <style>{`
        @keyframes modalOverlayIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes modalOverlayOut { from { opacity:1 } to { opacity:0 } }
        @keyframes modalCardIn  { from { opacity:0; transform:scale(0.93) translateY(28px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes modalCardOut { from { opacity:1; transform:scale(1) translateY(0) } to { opacity:0; transform:scale(0.95) translateY(16px) } }
        .fm-order-btn { transition: background-color 0.2s ease, transform 0.15s ease; }
        .fm-order-btn:hover:not(:disabled) { background-color: ${T.primaryDark} !important; transform: scale(1.01); }
        .fm-close-btn { transition: border-color 0.2s ease, color 0.2s ease; }
        .fm-close-btn:hover { border-color: ${T.primary} !important; color: ${T.primary} !important; }
        .fm-x-btn { transition: background-color 0.2s ease; }
        .fm-x-btn:hover { background-color: rgba(0,0,0,0.70) !important; }
        .fm-variant-btn { transition: all 0.15s ease; cursor: pointer; }
        .fm-addon-row { display: flex; align-items: center; gap: 10; padding: 8px 0; border-bottom: 1px solid ${T.border}; }
        .fm-addon-row:last-child { border-bottom: none; }
      `}</style>

      {/* Overlay */}
      <div
        onClick={handleClose}
        className="fixed inset-0 flex items-center justify-center"
        style={{
          zIndex: 1000,
          backgroundColor: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: `${visible ? 'modalOverlayIn' : 'modalOverlayOut'} 0.26s ease forwards`,
          padding: '16px',
        }}
      >
        {/* Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full"
          style={{
            position: 'relative',
            maxWidth: 760,
            boxShadow: '0 28px 64px rgba(0,0,0,0.24)',
            animation: `${visible ? 'modalCardIn' : 'modalCardOut'} 0.28s cubic-bezier(.4,0,.2,1) forwards`,
            maxHeight: '92vh',
            overflowY: 'auto',
          }}
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          {/* Close × */}
          <button
            onClick={handleClose}
            className="fm-x-btn absolute flex items-center justify-center rounded-full"
            style={{
              top: 14, right: 14, zIndex: 10,
              width: 36, height: 36,
              backgroundColor: 'rgba(0,0,0,0.42)',
              border: 'none', cursor: 'pointer',
              color: '#fff', backdropFilter: 'blur(4px)',
            }}
            aria-label="Close"
          >
            <X size={17} />
          </button>

          {/* Image carousel */}
          <div style={{ padding: '16px 16px 0', position: 'relative' }}>
            <div className="relative overflow-hidden w-full" style={{ aspectRatio: '16/9', borderRadius: 14, background: '#F3F4F6' }}>
              {images.length > 0 ? (
                <img
                  key={images[imgIdx]}
                  src={images[imgIdx]}
                  alt={item.name}
                  loading="lazy"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover block"
                  onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart size={48} color="#D1D5DB" />
                </div>
              )}
              {item.badge && (
                <span
                  className="absolute top-3 left-3"
                  style={{
                    backgroundColor: T.primary, color: '#fff',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.8px',
                    textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4,
                  }}
                >
                  {item.badge}
                </span>
              )}
              {/* Carousel arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                    style={{
                      position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff',
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                    style={{
                      position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.45)', border: 'none', borderRadius: '50%',
                      width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: '#fff',
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                  {/* Dots */}
                  <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 5 }}>
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        style={{
                          width: i === imgIdx ? 18 : 7, height: 7, borderRadius: 4,
                          background: i === imgIdx ? T.primary : 'rgba(255,255,255,0.7)',
                          border: 'none', cursor: 'pointer', padding: 0,
                          transition: 'all 0.2s ease',
                        }}
                        aria-label={`Image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 24px 28px' }}>

            {/* Title + computed price */}
            <div className="flex items-start justify-between gap-4" style={{ marginBottom: 8 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: T.dark, lineHeight: 1.35, margin: 0, flex: 1 }}>
                {item.name}
              </h2>
              <span style={{ fontSize: 22, fontWeight: 800, color: T.primary, flexShrink: 0, marginTop: 2 }}>
                ${computedPrice.toFixed(2)}
              </span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 flex-wrap" style={{ marginBottom: item.description ? 16 : 0 }}>
              {item.rating > 0 && <Stars rating={item.rating} />}
              {item.orders  > 0 && <span style={{ fontSize: 12, color: T.muted }}>{item.orders} orders today</span>}
              {item.category && (
                <span style={{ fontSize: 11, fontWeight: 600, color: T.primary, backgroundColor: T.badgeBg, padding: '2px 10px', borderRadius: 12 }}>
                  {item.category}
                </span>
              )}
              {item.isAvailable === false && (
                <span style={{ fontSize: 11, fontWeight: 600, color: '#EF4444', backgroundColor: '#FEF2F2', padding: '2px 10px', borderRadius: 12 }}>
                  Unavailable
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, marginTop: 12, marginBottom: 20, maxWidth: 600 }}>
                {item.description}
              </p>
            )}

            {/* ── Variant selector ── */}
            {variants.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.dark, marginBottom: 10 }}>Size</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {variants.map((v, idx) => {
                    const isSelected = selectedVariant === v;
                    // label: prefer size/name (already normalised), fall back to type, then index
                    const label = v.size ?? v.name ?? v.type ?? `Option ${idx + 1}`;
                    // key: use label (unique per product) or index as last resort
                    const keyVal = v.size ?? v.name ?? v.type ?? v._id ?? String(idx);
                    return (
                      <button
                        key={keyVal}
                        onClick={() => setSelectedVariant(v)}
                        className="fm-variant-btn"
                        style={{
                          padding: '8px 18px',
                          borderRadius: 10,
                          border: `1.5px solid ${isSelected ? T.primary : T.border}`,
                          background: isSelected ? T.badgeBg : '#fff',
                          color: isSelected ? T.primary : T.dark,
                          fontSize: 13, fontWeight: isSelected ? 700 : 500,
                        }}
                      >
                        {label}
                        {v.price != null && (
                          <span style={{ marginLeft: 6, fontSize: 12, color: isSelected ? T.primaryDark : T.muted }}>
                            ${Number(v.price).toFixed(2)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Addons ── */}
            {addonOptions.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.dark, marginBottom: 8 }}>Add-ons</p>
                <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, padding: '0 14px', background: '#FAFAFA' }}>
                  {addonOptions.map((addon) => {
                    const label = typeof addon === 'string' ? addon : (addon.name ?? String(addon));
                    const checked = selectedAddons.includes(label);
                    return (
                      <label key={label} className="fm-addon-row" style={{ cursor: 'pointer', userSelect: 'none' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAddon(label)}
                          style={{ accentColor: T.primary, width: 16, height: 16 }}
                        />
                        <span style={{ fontSize: 13, color: T.dark, flex: 1 }}>{label}</span>
                        {typeof addon === 'object' && addon.price != null && (
                          <span style={{ fontSize: 12, color: T.muted }}>+${Number(addon.price).toFixed(2)}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: T.border, marginBottom: 20 }} />

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={added || item.isAvailable === false}
                className="fm-order-btn flex items-center justify-center gap-2 flex-1"
                style={{
                  minWidth: 160, height: 48, borderRadius: 10,
                  backgroundColor: added ? T.primaryDark : T.primary,
                  color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 700,
                  cursor: (added || item.isAvailable === false) ? 'default' : 'pointer',
                  boxShadow: '0 4px 14px rgba(45,190,96,0.28)',
                  opacity: item.isAvailable === false ? 0.55 : 1,
                }}
              >
                {added ? <Check size={16} /> : <ShoppingCart size={16} />}
                {added ? 'Added to cart!' : item.isAvailable === false ? 'Unavailable' : 'Add to Cart'}
              </button>

              <button
                onClick={handleViewCart}
                className="fm-close-btn flex-1"
                style={{
                  minWidth: 120, height: 48, borderRadius: 10,
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${T.border}`,
                  color: T.muted, fontSize: 14, fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FoodModal;

