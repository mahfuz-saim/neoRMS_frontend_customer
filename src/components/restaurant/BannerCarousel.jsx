/* ─────────────────────────────────────────────────────────────────
   BannerCarousel
   Full-width hero carousel used on every restaurant home page.

   Props:
     restaurant    — the currentRestaurant object from context
     restaurantId  — string, used to build /menu and /about links

   Behaviour:
   • Builds a 3-slide deck: bannerImage from backend + 2 curated
     food-photography fallbacks (so there is always something to
     carousel through even if backend returns a single image).
   • Auto-advances every 5 s; pauses on hover.
   • Smooth CSS cross-fade transition (0.7 s).
   • Prev / Next arrow buttons + dot indicators.
   • Responsive — works on mobile and desktop.
   • Pulls under the 80 px fixed navbar via marginTop: -80.
   ───────────────────────────────────────────────────────────────── */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, UtensilsCrossed, CalendarDays } from 'lucide-react';

const C = {
  primary:      '#2DBE60',
  primaryHover: '#22A455',
};

/* ── Curated fallback food images ─────────────────────────────── */
const FALLBACKS = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80',
];

const buildSlides = (bannerImage) => {
  const primary = bannerImage || null;
  if (primary) {
    // Use the restaurant image as the first slide + 2 fallbacks so carousel has substance
    return [primary, FALLBACKS[1], FALLBACKS[2]];
  }
  return FALLBACKS;
};

/* ── Slide overlay content ── */
const SlideContent = ({ restaurant, restaurantId, isFirst }) => (
  <div
    style={{
      position: 'relative', zIndex: 3,
      textAlign: 'center',
      padding: '0 24px',
      maxWidth: 760,
      margin: '0 auto',
    }}
  >
    {/* Welcome badge — only on first slide */}
    {isFirst && (
      <span
        style={{
          display:       'inline-block',
          background:    'rgba(45,190,96,0.88)',
          color:         '#fff',
          fontSize:      12, fontWeight: 700, letterSpacing: '1.3px',
          textTransform: 'uppercase',
          padding:       '5px 18px', borderRadius: 20, marginBottom: 22,
          boxShadow:     '0 2px 10px rgba(0,0,0,0.25)',
        }}
      >
        🍽️ Welcome to
      </span>
    )}

    {/* Restaurant name */}
    <h1
      style={{
        fontSize:   'clamp(30px, 6.5vw, 66px)',
        fontWeight: 900,
        color:      '#fff',
        lineHeight: 1.1,
        margin:     isFirst ? '0 0 16px' : '0 0 20px',
        textShadow: '0 3px 16px rgba(0,0,0,0.45)',
        letterSpacing: '-0.5px',
      }}
    >
      {restaurant.name || 'Restaurant'}
    </h1>

    {/* Tagline */}
    {restaurant.tagline && (
      <p
        style={{
          fontSize:   'clamp(14px, 2.4vw, 19px)',
          color:      'rgba(255,255,255,0.88)',
          margin:     '0 auto 34px',
          lineHeight: 1.65,
          maxWidth:   560,
          textShadow: '0 1px 8px rgba(0,0,0,0.35)',
        }}
      >
        {restaurant.tagline}
      </p>
    )}

    {/* CTA buttons */}
    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
      <Link
        to={`/restaurant/${restaurantId}/menu`}
        style={{
          padding:        '14px 32px', borderRadius: 12,
          background:     C.primary, color: '#fff',
          fontSize:       15, fontWeight: 700,
          textDecoration: 'none',
          display:        'inline-flex', alignItems: 'center', gap: 9,
          boxShadow:      '0 4px 20px rgba(45,190,96,0.45)',
          transition:     'background 0.2s, transform 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background  = C.primaryHover;
          e.currentTarget.style.transform   = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background  = C.primary;
          e.currentTarget.style.transform   = 'scale(1)';
        }}
      >
        <UtensilsCrossed size={17} /> Explore Menu
      </Link>
      <Link
        to="/reservations"
        style={{
          padding:        '14px 32px', borderRadius: 12,
          background:     'rgba(255,255,255,0.14)',
          backdropFilter: 'blur(10px)',
          border:         '1.5px solid rgba(255,255,255,0.40)',
          color:          '#fff',
          fontSize:       15, fontWeight: 600,
          textDecoration: 'none',
          display:        'inline-flex', alignItems: 'center', gap: 9,
          transition:     'background 0.2s, transform 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.26)';
          e.currentTarget.style.transform  = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
          e.currentTarget.style.transform  = 'scale(1)';
        }}
      >
        <CalendarDays size={17} /> Book a Table
      </Link>
    </div>
  </div>
);

/* ── Main carousel ── */
const BannerCarousel = ({ restaurant, restaurantId }) => {
  const slides        = buildSlides(restaurant?.bannerImage || restaurant?.coverImage || restaurant?.image);
  const [current,  setCurrent ] = useState(0);
  const [fading,   setFading  ] = useState(false);
  const timerRef               = useRef(null);
  const pausedRef              = useRef(false);

  const goTo = useCallback((index) => {
    const next = (index + slides.length) % slides.length;
    setFading(true);
    setTimeout(() => {
      setCurrent(next);
      setFading(false);
    }, 350);
  }, [slides.length]);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        goTo(current + 1);
      }
    }, 5000);
  }, [current, goTo]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handlePrev = () => { clearInterval(timerRef.current); goTo(current - 1); };
  const handleNext = () => { clearInterval(timerRef.current); goTo(current + 1); };

  return (
    <>
      <style>{`
        @keyframes bc-ken-burns {
          from { transform: scale(1.00); }
          to   { transform: scale(1.07); }
        }
        .bc-slide-img {
          animation: bc-ken-burns 8s ease-in-out infinite alternate;
        }
        .bc-arrow {
          transition: background 0.2s, transform 0.15s;
        }
        .bc-arrow:hover {
          background: rgba(255,255,255,0.28) !important;
          transform: scale(1.08);
        }
        .bc-dot {
          transition: all 0.3s;
          cursor: pointer;
          border: none;
        }
        .bc-dot:hover { transform: scale(1.25); }
      `}</style>

      <div
        style={{
          position:   'relative',
          width:      '100%',
          minHeight:  '80vh',
          overflow:   'hidden',
          marginTop:  -80,               /* slide under fixed 80px nav */
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0F2318',          /* dark green fallback */
        }}
        onMouseEnter={() => { pausedRef.current = true;  }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        {/* ── Background image with cross-fade ── */}
        <div
          className="bc-slide-img"
          style={{
            position:           'absolute', inset: 0,
            backgroundImage:    `url(${slides[current]})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            opacity:            fading ? 0 : 1,
            transition:         'opacity 0.7s ease-in-out',
          }}
        />

        {/* ── Dark gradient overlay ── */}
        <div
          style={{
            position:   'absolute', inset: 0,
            background: 'linear-gradient(170deg, rgba(0,0,0,0.60) 0%, rgba(15,47,28,0.55) 100%)',
            zIndex:     1,
          }}
        />

        {/* ── Bottom gradient fade ── */}
        <div
          style={{
            position:   'absolute', bottom: 0, left: 0, right: 0,
            height:     '30%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.50), transparent)',
            zIndex:     1,
          }}
        />

        {/* ── Slide content ── */}
        <div
          style={{
            position: 'relative', zIndex: 3,
            width: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '120px 24px 80px',
            opacity:    fading ? 0 : 1,
            transform:  fading ? 'translateY(12px)' : 'translateY(0)',
            transition: 'opacity 0.55s ease-in-out, transform 0.55s ease-in-out',
          }}
        >
          <SlideContent
            restaurant={restaurant}
            restaurantId={restaurantId}
            isFirst={current === 0}
          />
        </div>

        {/* ── Prev arrow ── */}
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="bc-arrow"
          style={{
            position:   'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
            zIndex:     4,
            width:      46, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.35)',
            cursor:     'pointer', color: '#fff',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* ── Next arrow ── */}
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="bc-arrow"
          style={{
            position:   'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
            zIndex:     4,
            width:      46, height: 46, borderRadius: '50%',
            background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.35)',
            cursor:     'pointer', color: '#fff',
            display:    'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* ── Dot indicators ── */}
        <div
          style={{
            position:   'absolute', bottom: 26, left: 0, right: 0,
            display:    'flex', justifyContent: 'center',
            gap:        8, zIndex: 4,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              className="bc-dot"
              onClick={() => { clearInterval(timerRef.current); goTo(i); }}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width:      i === current ? 28 : 10,
                height:     10,
                borderRadius: 5,
                background: i === current ? C.primary : 'rgba(255,255,255,0.45)',
                padding:    0,
              }}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div
          style={{
            position:   'absolute', top: 100, right: 24,
            zIndex:     4,
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(8px)',
            border:     '1px solid rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding:    '4px 14px',
            color:      'rgba(255,255,255,0.8)',
            fontSize:   12, fontWeight: 600,
          }}
        >
          {current + 1} / {slides.length}
        </div>
      </div>
    </>
  );
};

export default BannerCarousel;
