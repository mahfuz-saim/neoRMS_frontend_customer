import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import FoodCard from '../components/menu/FoodCard';
import FoodModal from '../components/menu/FoodModal';
import { getRestaurantMenu } from '../services/restaurantService';
import { useRestaurant } from '../context/RestaurantContext';
import { Utensils } from 'lucide-react';

/* --- Theme tokens -- */
const T = {
  primary:   '#E63946',
  dark:      '#1F2937',
  muted:     '#6B7280',
  border:    '#E5E7EB',
  sectionBg: '#F7FDF9',
  badgeBg:   'rgba(230,57,70,0.12)',
};

/* --- Normalize raw menuProduct API items ? grouped category structure -- */
const normaliseItem = (raw) => {
  const variants = Array.isArray(raw.variants) ? raw.variants : [];
  const basePrice = variants.length > 0
    ? Number(variants[0].price ?? 0)
    : Number(raw.price ?? 0);
  const images = Array.isArray(raw.images) && raw.images.length > 0
    ? raw.images
    : raw.image ? [raw.image] : raw.imageUrl ? [raw.imageUrl] : [];
  return {
    id:          raw._id ?? raw.id,
    name:        raw.name ?? 'Unnamed Item',
    description: raw.description ?? '',
    images,
    image:       images[0] ?? '',
    category:    raw.category ?? raw.categoryName ?? 'Menu',
    variants,
    addons:      Array.isArray(raw.addons) ? raw.addons : [],
    price:       basePrice,
    isAvailable: raw.isAvailable !== false,
    badge:       raw.badge ?? (raw.isPopular ? 'Popular' : null),
    rating:      Number(raw.rating ?? 0),
    orders:      Number(raw.orders ?? 0),
  };
};

const buildCategoriesFromItems = (items) => {
  const map = new Map();
  for (const item of items) {
    const cat = item.category;
    if (!map.has(cat)) {
      map.set(cat, {
        id:    cat.toLowerCase().replace(/\s+/g, '-'),
        title: cat,
        items: [],
      });
    }
    map.get(cat).items.push(item);
  }
  return Array.from(map.values());
};

/* --- Skeleton loader -- */
const MenuSkeleton = () => (
  <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 24px' }}>
    <style>{`@keyframes dm-skel { 0%,100%{opacity:1} 50%{opacity:.45} }`}</style>
    {[1, 2].map((s) => (
      <div key={s} style={{ marginBottom: 80 }}>
        <div style={{ height: 28, width: 200, background: '#E5E7EB', borderRadius: 8, marginBottom: 12, animation: 'dm-skel 1.4s ease-in-out infinite' }} />
        <div style={{ height: 14, width: 320, background: '#F3F4F6', borderRadius: 6, marginBottom: 32, animation: 'dm-skel 1.4s ease-in-out infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 24 }}>
          {[1, 2, 3, 4].map((c) => (
            <div key={c} style={{ borderRadius: 12, overflow: 'hidden', background: '#F9FAFB', animation: 'dm-skel 1.4s ease-in-out infinite' }}>
              <div style={{ height: 160, background: '#E5E7EB' }} />
              <div style={{ padding: 12 }}>
                <div style={{ height: 16, background: '#E5E7EB', borderRadius: 6, marginBottom: 8 }} />
                <div style={{ height: 14, width: '60%', background: '#F3F4F6', borderRadius: 6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* --- useInView -- */
const useInView = (threshold = 0.08) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

/* --- Category section -- */
const CategorySection = ({ category, onSelectItem }) => {
  const [ref, inView] = useInView(0.06);
  return (
    <section
      ref={ref}
      id={category.id}
      style={{ marginTop: 24, marginBottom: 48 }}
    >
      <div
        className={inView ? 'dm-fade-in' : 'opacity-0'}
        style={{ marginBottom: 0 }}
      >
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: T.primary, margin: '0 0 10px' }}>
          {category.title}
        </h2>
        {category.description && (
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 12 }}>
            {category.description}
          </p>
        )}
        <div style={{ height: 1, backgroundColor: T.border, marginBottom: 10 }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
        {category.items.map((item, i) => (
          <div
            key={item.id}
            className={inView ? 'dm-fade-in' : 'opacity-0'}
            style={{ animationDelay: `${0.06 * i}s` }}
          >
            <FoodCard item={item} onClick={onSelectItem} />
          </div>
        ))}
      </div>
    </section>
  );
};

/* --- Main page -- */
const DigitalMenuPage = () => {
  /* restaurantId from URL params (works inside /restaurant/:restaurantId/menu) */
  const { restaurantId: paramId } = useParams();

  /* Also read from context � RestaurantBoundary always sets it */
  const { currentRestaurant } = useRestaurant();
  const ctxRestaurantId = currentRestaurant?.id ?? currentRestaurant?._id ?? null;

  const restaurantId = paramId ?? ctxRestaurantId;

  const [selected,   setSelected  ] = useState(null);
  const [activeTab,  setActiveTab ] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [apiError,   setApiError  ] = useState(null);

  /* -- Fetch menu from backend � NO static fallback -- */
  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      setApiError('No restaurant selected.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setApiError(null);
    setCategories([]);

    getRestaurantMenu(restaurantId)
      .then((items) => {
        if (cancelled) return;
        // Service already unwraps the envelope � items is always an array
        const cats = buildCategoriesFromItems(items.map(normaliseItem));
        setCategories(cats);
        setActiveTab(cats[0]?.id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setApiError(err?.message || 'Failed to load menu.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [restaurantId]);

  /* -- Sync active tab while scrolling -- */
  useEffect(() => {
    if (categories.length === 0) return;
    const handleScroll = () => {
      for (const cat of categories) {
        const el = document.getElementById(cat.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 96) setActiveTab(cat.id);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollToCategory = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    /* nav (80px) + tab bar (~40px) */
    const OFFSET = 80 + 40;
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (loading) return <MenuSkeleton />;

  /* Error state � no static fallback */
  if (apiError) return (
    <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <Utensils size={52} color="#D1D5DB" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: T.dark, marginBottom: 8 }}>Menu Unavailable</h2>
        <p style={{ fontSize: 14, color: T.muted }}>{apiError}</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes dmFadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .dm-fade-in { animation: dmFadeSlideUp 0.55s cubic-bezier(.4,0,.2,1) both; }

        .popular-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(31,41,55,0.13);
        }
        .popular-card:focus-visible { box-shadow: 0 0 0 3px #E63946; }
        .popular-card:hover .popular-card-img { transform: scale(1.05); }

        .dm-tab-btn {
          transition: all 0.2s ease;
          white-space: nowrap;
          cursor: pointer;
          border: none;
          background: none;
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        .dm-tab-btn:hover { background-color: rgba(45,190,96,0.1); color: #E63946 !important; }
      `}</style>

      <div className="w-full" style={{ backgroundColor: '#ffffff' }}>

        {/* -- Sticky category tab bar -- */}
        {categories.length > 0 && (
          <div
            className="sticky z-40 w-full"
            style={{
              top: 80,
              backgroundColor: '#ffffff',
              borderBottom: `1px solid ${T.border}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                maxWidth: 1100, width: '100%',
                marginLeft: 'auto', marginRight: 'auto',
                padding: '2px 16px',
                display: 'flex', alignItems: 'center', gap: 4,
                overflowX: 'auto',
              }}
            >
              {categories.map(({ id, title }) => (
                <button
                  key={id}
                  onClick={() => scrollToCategory(id)}
                  className="dm-tab-btn shrink-0"
                  style={{
                    color:           activeTab === id ? T.primary : T.dark,
                    backgroundColor: activeTab === id ? T.badgeBg : 'transparent',
                    fontWeight:      activeTab === id ? 700        : 500,
                  }}
                >
                  {title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* spacer between tab bar and first section */}
        <div style={{ height: 12 }} />

        {/* -- Menu content -- */}
        <div
          style={{
            maxWidth: 1100, width: '100%',
            margin: '0 auto',
            paddingLeft: 24, paddingRight: 24,
            paddingBottom: 64,
          }}
        >
          {categories.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: T.muted }}>
              <p style={{ fontSize: 16, fontWeight: 600 }}>No menu items found for this restaurant.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                onSelectItem={setSelected}
              />
            ))
          )}
        </div>
      </div>

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

export default DigitalMenuPage;

