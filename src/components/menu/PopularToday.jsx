import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Flame, Utensils } from 'lucide-react';
import FoodCard  from './FoodCard';
import FoodModal from './FoodModal';
import { getRestaurantMenu } from '../../services/restaurantService';

/* --- Theme tokens ------------------------------------------------ */
const T = {
  primary:     '#E63946',
  primaryDark: '#C0252E',
  dark:        '#1F2937',
  muted:       '#6B7280',
  border:      '#E5E7EB',
  sectionBg:   '#F7FDF9',
  badgeBg:     'rgba(230,57,70,0.12)',
};

/* --- Skeleton card ----------------------------------------------- */
const SkeletonCard = () => (
  <div style={{
    borderRadius: 12, overflow: 'hidden',
    background: '#F9FAFB',
    animation: 'pt-skel 1.4s ease-in-out infinite',
    border: `1px solid ${T.border}`,
  }}>
    <div style={{ height: 160, background: '#E5E7EB' }} />
    <div style={{ padding: 14 }}>
      <div style={{ height: 14, background: '#E5E7EB', borderRadius: 6, marginBottom: 10 }} />
      <div style={{ height: 12, width: '60%', background: '#F3F4F6', borderRadius: 6 }} />
    </div>
  </div>
);

/* --- Empty state ------------------------------------------------- */
const EmptyState = () => (
  <div style={{
    textAlign: 'center', padding: '48px 24px',
    background: '#fff', borderRadius: 16,
    border: `1.5px solid ${T.border}`,
  }}>
    <Utensils size={44} color="#D1D5DB" style={{ marginBottom: 14 }} />
    <p style={{ fontSize: 15, fontWeight: 600, color: T.dark, margin: '0 0 6px' }}>
      No popular items yet
    </p>
    <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>
      Check back soon — the menu is being updated!
    </p>
  </div>
);

/* --- Normalise raw API item -------------------------------------- */
const normalise = (raw) => {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const images   = Array.isArray(raw.images) && raw.images.length > 0
    ? raw.images
    : raw.image   ? [raw.image]
    : raw.imageUrl ? [raw.imageUrl]
    : [];
  const basePrice = variants.length > 0
    ? Number(variants[0].price ?? 0)
    : Number(raw.price ?? 0);
  return {
    id:          raw._id      ?? raw.id,
    name:        raw.name,
    description: raw.description ?? '',
    shortDesc:   raw.shortDesc   ?? raw.description ?? '',
    price:       basePrice,
    variants,
    addons:      Array.isArray(raw.addons) ? raw.addons : [],
    rating:      Number(raw.rating ?? 0),
    orders:      Number(raw.orders ?? 0),
    badge:       raw.badge ?? null,
    images,
    image:       images[0] ?? '',
    category:    raw.category ?? 'Menu',
    isAvailable: raw.isAvailable !== false,
  };
};

/* --- Pick the popular subset ------------------------------------- */
const pickPopular = (items, max = 4) => {
  const flagged = items.filter(
    (i) => i.badge && ['best seller', 'popular', 'trending', 'hot'].includes(i.badge.toLowerCase()),
  );
  const pool = flagged.length >= 2 ? flagged : items;
  return [...pool]
    .sort((a, b) => (b.orders - a.orders) || (b.rating - a.rating))
    .slice(0, max);
};

/* --- useInView hook -- */
const useInView = (threshold = 0.1) => {
  const ref = useRef(null);
  const [inView, setInView] = React.useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/**
 * @param {string|null} restaurantId — from RestaurantContext; null ? global fallback
 */
const PopularToday = ({ restaurantId = null }) => {
  const [items,    setItems   ] = useState([]);
  const [loading,  setLoading ] = useState(false);
  const [selected, setSelected] = useState(null);
  const [headRef,  headIn    ] = useInView(0.15);

  /* -- Fetch / derive popular items ----------------------------- */
  useEffect(() => {
    let cancelled = false;

    if (!restaurantId) {
      // No restaurant context — hide section
      setItems([]);
      return;
    }

    setLoading(true);
    setItems([]);

    getRestaurantMenu(restaurantId)
      .then((items) => {
        if (cancelled) return;
        // Service already returns the items array
        setItems(pickPopular(items.map(normalise), 4));
      })
      .catch(() => { if (!cancelled) setItems([]); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [restaurantId]);

  const menuLink = restaurantId ? `/restaurant/${restaurantId}/menu` : '/daily-menu';

  return (
    <>
      <style>{`
        @keyframes pt-skel { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .pt-visible { animation: fadeSlideUp 0.6s cubic-bezier(.4,0,.2,1) both; }
        .popular-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(31,41,55,0.13);
        }
        .popular-card:focus-visible { box-shadow: 0 0 0 3px #E63946; }
        .popular-card:hover .popular-card-img { transform: scale(1.05); }
        .pt-cta-btn {
          text-decoration: none;
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .pt-cta-btn:hover {
          background-color: #C0252E !important;
          transform: scale(1.04);
          box-shadow: 0 8px 24px rgba(230,57,70,0.32) !important;
        }
      `}</style>

      <section
        className="w-full"
        style={{ position: 'relative', overflow: 'hidden', backgroundColor: T.sectionBg, padding: '96px 0 160px' }}
      >
        <div style={{
          maxWidth: 1100, width: '100%',
          marginLeft: 'auto', marginRight: 'auto',
          paddingLeft: 24, paddingRight: 24,
        }}>

          {/* -- Heading -- */}
          <div ref={headRef} className={`text-center ${headIn ? 'pt-visible' : 'opacity-0'}`} style={{ marginBottom: 48 }}>
            <span
              className="inline-flex items-center gap-1.5 mb-4"
              style={{
                backgroundColor: T.badgeBg, color: T.primary,
                fontSize: 12, fontWeight: 700, letterSpacing: '1.4px',
                textTransform: 'uppercase', padding: '5px 18px', borderRadius: 20,
              }}
            >
              <Flame size={13} />
              Hot Right Now
            </span>
            <h2
              className="leading-tight mb-4"
              style={{ fontSize: '2.25rem', fontWeight: 800, color: T.dark }}
            >
              Popular Today
            </h2>
            <p style={{ fontSize: 15, color: T.muted, maxWidth: 520, margin: '0 auto' }}>
              The most-loved dishes from this restaurant, updated in real time.
            </p>
          </div>

          {/* -- Skeleton -- */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* -- Empty -- */}
          {!loading && items.length === 0 && <EmptyState />}

          {/* -- Grid -- */}
          {!loading && items.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={headIn ? 'pt-visible' : 'opacity-0'}
                  style={{ animationDelay: headIn ? `${0.07 * i}s` : '0s' }}
                >
                  <FoodCard item={item} onClick={setSelected} />
                </div>
              ))}
            </div>
          )}

          {/* -- CTA -- */}
          {!loading && (
            <div className="text-center" style={{ marginTop: 64, marginBottom: 0 }}>
              <Link
                to={menuLink}
                className="pt-cta-btn inline-flex items-center gap-2"
                style={{
                  height: 52, padding: '0 32px', borderRadius: 10,
                  backgroundColor: T.primary, color: '#fff',
                  fontSize: 15, fontWeight: 700,
                  boxShadow: '0 6px 20px rgba(230,57,70,0.28)',
                }}
              >
                View Full Menu
                <ChevronRight size={18} />
              </Link>
            </div>
          )}
        </div>

        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 72,
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.72))',
            pointerEvents: 'none',
          }}
        />
      </section>

      {selected && (
        <FoodModal
          item={selected}
          restaurantId={restaurantId}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default PopularToday;
