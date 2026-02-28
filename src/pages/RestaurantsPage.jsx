/* ─────────────────────────────────────────────────────────────────
   RestaurantsPage  —  /restaurants

   Layout order:
     1. Sticky search bar (directly below navbar)
     2. Round food-category icons (filter)
     3. Restaurant cards grid

   No hero banner. No popular dishes.
   ───────────────────────────────────────────────────────────────── */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Search, Utensils, X } from 'lucide-react';
import { getAllRestaurants } from '../services/restaurantService';
import { useRestaurant } from '../context/RestaurantContext';

/* ── Theme ── */
const C = {
  primary:      '#2DBE60',
  primaryHover: '#22A455',
  dark:         '#1F2937',
  muted:        '#6B7280',
  border:       '#E5E7EB',
  bg:           '#F4FAF6',
  cardBg:       '#FFFFFF',
  shadow:       '0 2px 14px rgba(31,41,55,0.07)',
  shadowHover:  '0 8px 32px rgba(31,41,55,0.14)',
};

/* ── Food categories for filtering ── */
const CATEGORIES = [
  { id: 'burger',   label: 'Burger',   image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=75',  keywords: ['burger', 'burgers', 'fast food', 'american'] },
  { id: 'pizza',    label: 'Pizza',    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=75',  keywords: ['pizza', 'italian', 'pizzeria'] },
  { id: 'biryani',  label: 'Biryani',  image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=200&q=75',  keywords: ['biryani', 'rice', 'indian', 'mughlai'] },
  { id: 'chinese',  label: 'Chinese',  image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=200&q=75',  keywords: ['chinese', 'noodles', 'dim sum', 'asian', 'wok'] },
  { id: 'sushi',    label: 'Sushi',    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=200&q=75',  keywords: ['sushi', 'japanese', 'ramen', 'sashimi'] },
  { id: 'seafood',  label: 'Seafood',  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=200&q=75',  keywords: ['seafood', 'fish', 'prawn', 'crab', 'lobster'] },
  { id: 'desserts', label: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=200&q=75',  keywords: ['dessert', 'desserts', 'cake', 'sweet', 'ice cream', 'bakery'] },
  { id: 'drinks',   label: 'Drinks',   image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=200&q=75',  keywords: ['drinks', 'juice', 'smoothie', 'cafe', 'coffee', 'beverage', 'bar'] },
  { id: 'healthy',  label: 'Healthy',  image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=200&q=75',  keywords: ['healthy', 'salad', 'vegan', 'vegetarian', 'organic', 'diet'] },
  { id: 'mexican',  label: 'Mexican',  image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=200&q=75',  keywords: ['mexican', 'taco', 'tacos', 'burrito', 'quesadilla'] },
];

/* ── Skeleton card ── */
const SkeletonCard = () => (
  <div
    style={{
      background: C.cardBg, borderRadius: 16, overflow: 'hidden',
      boxShadow: C.shadow, animation: 'rp-pulse 1.5s ease-in-out infinite',
    }}
  >
    <div style={{ height: 190, background: '#E5E7EB' }} />
    <div style={{ padding: '18px 20px 22px' }}>
      <div style={{ height: 18, width: '65%', background: '#E5E7EB', borderRadius: 8, marginBottom: 10 }} />
      <div style={{ height: 13, width: '85%', background: '#F3F4F6', borderRadius: 6, marginBottom: 8 }} />
      <div style={{ height: 13, width: '45%', background: '#F3F4F6', borderRadius: 6 }} />
    </div>
  </div>
);

/* ── Category icon (circular) ── */
const CategoryIcon = ({ cat, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const lit = active || hovered;
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 10, cursor: 'pointer', background: 'none', border: 'none',
        padding: '6px 8px', outline: 'none', minWidth: 76,
      }}
      aria-label={`Filter by ${cat.label}`}
    >
      {/* Outer ring (active glow) */}
      <div style={{
        width: 76, height: 76, borderRadius: '50%', padding: 3, flexShrink: 0,
        background: active
          ? 'linear-gradient(135deg, #2DBE60 0%, #22A455 100%)'
          : 'transparent',
        boxShadow: active
          ? '0 0 0 2px rgba(45,190,96,0.18), 0 6px 18px rgba(45,190,96,0.22)'
          : lit ? '0 4px 14px rgba(31,41,55,0.11)' : 'none',
        transform: lit ? 'translateY(-4px) scale(1.07)' : 'translateY(0) scale(1)',
        transition: 'all 0.22s ease',
      }}>
        {/* Inner circle with image */}
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden',
          border: active ? '2px solid #fff' : `2px solid ${lit ? '#D1D5DB' : '#E5E7EB'}`,
        }}>
          <img src={cat.image} alt={cat.label} loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>
      <span style={{
        fontSize: 11.5, fontWeight: active ? 700 : 500,
        color: active ? C.primary : lit ? C.dark : C.muted,
        letterSpacing: '0.2px', whiteSpace: 'nowrap',
        transition: 'color 0.2s ease',
        lineHeight: 1.2,
      }}>
        {cat.label}
      </span>
    </button>
  );
};

/* ── Restaurant card ── */
const RestaurantCard = ({ restaurant, onClick }) => {
  const [hovered, setHovered] = useState(false);

  const bannerSrc = restaurant.bannerImage || restaurant.image || restaurant.logo || null;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    C.cardBg,
        borderRadius:  16,
        overflow:      'hidden',
        boxShadow:     hovered ? C.shadowHover : C.shadow,
        cursor:        'pointer',
        transform:     hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition:    'all 0.22s ease',
        border:        `1.5px solid ${hovered ? C.primary : C.border}`,
        outline:       'none',
      }}
    >
      {/* Banner */}
      <div
        style={{
          height:              190,
          background:          bannerSrc
            ? `url(${bannerSrc}) center/cover no-repeat`
            : `linear-gradient(135deg, #1F5C2E 0%, ${C.primary} 100%)`,
          position:            'relative',
          display:             'flex',
          alignItems:          'center',
          justifyContent:      'center',
          overflow:            'hidden',
        }}
      >
        {/* Dark tint */}
        <div style={{
          position: 'absolute', inset: 0,
          background: bannerSrc
            ? 'rgba(0,0,0,0.35)'
            : 'rgba(0,0,0,0.10)',
        }} />

        {/* Fallback icon */}
        {!bannerSrc && (
          <Utensils size={52} color="rgba(255,255,255,0.6)" style={{ position: 'relative', zIndex: 1 }} />
        )}

        {/* "Open" pill */}
        <div style={{
          position:         'absolute', top: 12, right: 12,
          background:       'rgba(45,190,96,0.92)', color: '#fff',
          fontSize:         11, fontWeight: 700, letterSpacing: '0.5px',
          padding:          '3px 10px', borderRadius: 20, zIndex: 2,
        }}>
          OPEN
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 20px' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: C.dark, margin: '0 0 5px' }}>
          {restaurant.name || 'Restaurant'}
        </h3>

        {restaurant.tagline && (
          <p style={{
            fontSize: 13, color: C.muted, margin: '0 0 10px',
            overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {restaurant.tagline}
          </p>
        )}

        {restaurant.location && (
          <p style={{
            fontSize: 12, color: C.muted,
            display: 'flex', alignItems: 'center', gap: 4, margin: '0 0 14px',
          }}>
            <MapPin size={12} color={C.primary} />
            {restaurant.location}
          </p>
        )}

        {/* CTA row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: restaurant.location ? 0 : 14,
        }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: C.primary,
            background: 'rgba(45,190,96,0.10)', padding: '4px 10px',
            borderRadius: 20,
          }}>
            View Menu
          </span>
          <ChevronRight size={16} color={C.primary} />
        </div>
      </div>
    </div>
  );
};

/* ── Match restaurant against a category's keywords ── */
const restaurantMatchesCategory = (r, cat) => {
  const haystack = [
    r.name, r.tagline, r.description, r.cuisine,
    r.category, r.cuisineType,
    ...(Array.isArray(r.categories) ? r.categories : []),
  ]
    .filter(Boolean).join(' ').toLowerCase();
  return cat.keywords.some((kw) => haystack.includes(kw));
};

/* ── Main page ── */
const RestaurantsPage = () => {
  const navigate = useNavigate();
  const { setCurrentRestaurant } = useRestaurant();

  const [restaurants,    setRestaurants   ] = useState([]);
  const [loading,        setLoading       ] = useState(true);
  const [error,          setError         ] = useState(null);
  const [search,         setSearch        ] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getAllRestaurants()
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : (data?.data ?? data?.restaurants ?? []);
        setRestaurants(list);
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load restaurants.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => { setCurrentRestaurant(null); }, [setCurrentRestaurant]);

  const filtered = restaurants.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      const textMatch =
        (r.name     || '').toLowerCase().includes(q) ||
        (r.tagline  || '').toLowerCase().includes(q) ||
        (r.location || '').toLowerCase().includes(q) ||
        (r.cuisine  || '').toLowerCase().includes(q) ||
        (r.category || '').toLowerCase().includes(q);
      if (!textMatch) return false;
    }
    if (activeCategory) {
      const cat = CATEGORIES.find((c) => c.id === activeCategory);
      if (cat && !restaurantMatchesCategory(r, cat)) return false;
    }
    return true;
  });

  const handleSelect   = (r) => navigate(`/restaurant/${r._id ?? r.id}`);
  const toggleCategory = (id) => setActiveCategory((prev) => (prev === id ? null : id));
  const clearAll       = () => { setSearch(''); setActiveCategory(null); };
  const hasFilters     = !!(search || activeCategory);

  return (
    <div style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: C.bg, paddingBottom: 60 }}>
      <style>{`
        @keyframes rp-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        .rp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .rp-grid { grid-template-columns: 1fr; }
        }
        /* Category row */
        .rp-cat-row {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          padding: 4px 4px 8px;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        @media (min-width: 768px) {
          .rp-cat-row {
            justify-content: center;
            flex-wrap: wrap;
            overflow-x: visible;
            gap: 8px;
          }
        }
        .rp-cat-row::-webkit-scrollbar { display: none; }
        .rp-cat-row { scrollbar-width: none; }
        /* Search bar */
        .rp-search-wrap {
          background: #ffffff;
          box-shadow: 0 1px 0 0 ${C.border};
        }
        .rp-search-inner {
          max-width: 640px;
          margin: 0 auto;
          padding: 16px 20px 14px;
        }
        .rp-search-input-box {
          display: flex; align-items: center; gap: 10;
          background: ${C.bg};
          border-radius: 999px;
          padding: 12px 20px;
          border: 1.5px solid ${C.border};
          box-shadow: 0 2px 10px rgba(31,41,55,0.06);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .rp-search-input-box:focus-within {
          border-color: ${C.primary};
          box-shadow: 0 0 0 3px rgba(45,190,96,0.13), 0 2px 10px rgba(31,41,55,0.06);
        }
        /* Sticky band */
        .rp-sticky {
          position: sticky;
          top: 80px;
          z-index: 30;
          background: #fff;
          box-shadow: 0 2px 12px rgba(31,41,55,0.07);
        }
      `}</style>

      {/* ① Sticky Search + Categories band */}
      <div className="rp-sticky">

        {/* Search bar */}
        <div className="rp-search-wrap">
          <div className="rp-search-inner">
            <div className="rp-search-input-box">
              <Search size={17} color={C.muted} style={{ flexShrink: 0 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants by name, cuisine or location…"
                style={{
                  border: 'none', outline: 'none', flex: 1,
                  fontSize: 14.5, color: C.dark, background: 'transparent',
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  style={{
                    border: 'none', background: 'none', cursor: 'pointer',
                    color: C.muted, padding: 0, display: 'flex', alignItems: 'center',
                    flexShrink: 0,
                  }}
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ② Food Category Icons */}
        <div style={{
          background: '#FAFAFA',
          borderBottom: `1px solid ${C.border}`,
          padding: '16px 0 12px',
        }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 16px' }}>
            <div className="rp-cat-row">
              {CATEGORIES.map((cat) => (
                <CategoryIcon
                  key={cat.id}
                  cat={cat}
                  active={activeCategory === cat.id}
                  onClick={() => toggleCategory(cat.id)}
                />
              ))}
            </div>
          </div>
        </div>

      </div>{/* end sticky band */}

      {/* ③ Active filter chips */}
      {hasFilters && (
        <div style={{
          maxWidth: 1140, margin: '20px auto 0', padding: '0 20px',
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 500 }}>Filters:</span>

          {search && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(45,190,96,0.10)', color: C.primary,
              fontSize: 12.5, fontWeight: 600, padding: '4px 12px',
              borderRadius: 20, border: '1px solid rgba(45,190,96,0.25)',
            }}>
              &ldquo;{search}&rdquo;
              <button onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: C.primary, display: 'flex', alignItems: 'center' }}>
                <X size={13} />
              </button>
            </span>
          )}

          {activeCategory && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(45,190,96,0.10)', color: C.primary,
              fontSize: 12.5, fontWeight: 600, padding: '4px 12px',
              borderRadius: 20, border: '1px solid rgba(45,190,96,0.25)',
            }}>
              {CATEGORIES.find((c) => c.id === activeCategory)?.label}
              <button onClick={() => setActiveCategory(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  color: C.primary, display: 'flex', alignItems: 'center' }}>
                <X size={13} />
              </button>
            </span>
          )}

          <button onClick={clearAll}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: C.muted, textDecoration: 'underline', padding: 0 }}>
            Clear all
          </button>
        </div>
      )}

      {/* ④ Restaurant Cards */}
      <div style={{ maxWidth: 1140, margin: '32px auto 0', padding: '0 20px' }}>

        {/* Section header */}
        {!loading && !error && (
          <div style={{ marginBottom: 28, paddingBottom: 16, borderBottom: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, margin: 0 }}>
                {hasFilters ? 'Search Results' : 'All Restaurants'}
              </h2>
            </div>
            <span style={{ fontSize: 13, color: C.muted, flexShrink: 0 }}>
              {filtered.length === 0
                ? 'No restaurants found'
                : `${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''}${hasFilters ? ' found' : ''}`}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rp-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            textAlign: 'center', padding: '64px 24px',
            background: C.cardBg, borderRadius: 16, boxShadow: C.shadow,
          }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#EF4444', marginBottom: 8 }}>
              Oops! Something went wrong.
            </p>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px', borderRadius: 10, background: C.primary,
                color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '72px 24px',
            background: C.cardBg, borderRadius: 16, boxShadow: C.shadow,
          }}>
            <Utensils size={56} color="#D1D5DB" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
              {hasFilters ? 'No matches found' : 'No Restaurants Yet'}
            </h2>
            <p style={{ fontSize: 14, color: C.muted, marginBottom: hasFilters ? 20 : 0 }}>
              {hasFilters
                ? 'Try a different search or category.'
                : 'Check back soon — new restaurants are joining!'}
            </p>
            {hasFilters && (
              <button
                onClick={clearAll}
                style={{
                  padding: '9px 22px', borderRadius: 10, background: C.primary,
                  color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14,
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="rp-grid">
            {filtered.map((r) => (
              <RestaurantCard
                key={r._id ?? r.id}
                restaurant={r}
                onClick={() => handleSelect(r)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;
