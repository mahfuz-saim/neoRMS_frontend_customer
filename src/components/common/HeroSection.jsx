import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ChevronLeft, ChevronRight, Store } from 'lucide-react';

/* ─── Slide Data ─── */
const SLIDES = [
  {
    image:    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
    badge:    '🌿 Farm Fresh · 100% Natural',
    heading:  ['Taste The Art', 'Of Fine Dining'],
    tagline:  'Crafted with passion. Served with love. Every plate tells a story worth savoring.',
    cta1:     { label: 'Explore Menu',          to: '/menu' },
    cta2:     { label: 'Explore Restaurants',   to: '/restaurants' },
  },
  {
    image:    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80',
    badge:    '🍽️ Premium Experience · Est. 2018',
    heading:  ['Where Every Bite', 'Becomes Memory'],
    tagline:  'Warm ambiance, vibrant flavors, and moments you will carry forever.',
    cta1:     { label: 'Book A Table',          to: '/reservations' },
    cta2:     { label: 'Explore Restaurants',   to: '/restaurants' },
  },
];

/* ─── Particle ─── */
const Particle = ({ style }) => (
  <div className="hero-particle" style={{ position: 'absolute', borderRadius: '50%', pointerEvents: 'none', ...style }} />
);

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size:  4 + Math.random() * 6,
  left:  `${5 + Math.random() * 90}%`,
  top:   `${10 + Math.random() * 80}%`,
  delay: `${Math.random() * 6}s`,
  dur:   `${5 + Math.random() * 5}s`,
}));

const HeroSection = () => {
  const [active, setActive]   = useState(0);
  const [prev,   setPrev]     = useState(null);
  const [anim,   setAnim]     = useState(false);   /* trigger re-entry anim */
  const [paused, setPaused]   = useState(false);
  const timerRef              = useRef(null);

  const goTo = (idx) => {
    if (idx === active) return;
    setPrev(active);
    setActive(idx);
    setAnim(true);
    setTimeout(() => { setPrev(null); setAnim(false); }, 950);
  };

  const next = () => goTo((active + 1) % SLIDES.length);
  const prev_ = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);

  /* Auto-play */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, 4500);
    return () => clearTimeout(timerRef.current);
  }, [active, paused]);                             // eslint-disable-line

  const slide = SLIDES[active];

  return (
    <>
      <style>{`
        /* ── Slide layers ── */
        .hero-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          will-change: transform, opacity;
        }
        .hero-bg-enter {
          animation: heroBgEnter 1s cubic-bezier(.4,0,.2,1) forwards;
        }
        .hero-bg-exit {
          animation: heroBgExit 1s cubic-bezier(.4,0,.2,1) forwards;
        }
        @keyframes heroBgEnter {
          from { opacity: 0; transform: scale(1.07); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes heroBgExit {
          from { opacity: 1; transform: scale(1);    }
          to   { opacity: 0; transform: scale(0.97); }
        }

        /* ── Text animations ── */
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideLeftBounce {
          0%   { opacity: 0; transform: translateX(-48px) scaleX(0.92); }
          70%  { opacity: 1; transform: translateX(6px) scaleX(1.02); }
          100% { opacity: 1; transform: translateX(0) scaleX(1); }
        }

        .hero-badge {
          animation: slideLeftBounce 0.65s cubic-bezier(.4,0,.2,1) 0.05s both;
        }
        .hero-heading {
          animation: slideUpFade 0.7s cubic-bezier(.4,0,.2,1) 0.2s both;
        }
        .hero-tagline {
          animation: slideUpFade 0.7s cubic-bezier(.4,0,.2,1) 0.4s both;
        }
        .hero-cta {
          animation: slideUpFade 0.7s cubic-bezier(.4,0,.2,1) 0.6s both;
        }

        /* ── Decorative rays ── */
        @keyframes rayPulse {
          0%, 100% { opacity: 0.06; transform: scaleY(1);    }
          50%       { opacity: 0.13; transform: scaleY(1.04); }
        }
        .hero-ray {
          position: absolute;
          bottom: 0;
          width: 3px;
          transform-origin: bottom center;
          animation: rayPulse var(--dur, 3s) ease-in-out var(--delay, 0s) infinite;
          pointer-events: none;
          background: linear-gradient(to top, rgba(230,57,70,0.6), transparent);
          border-radius: 99px;
        }

        /* ── Particles ── */
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0)   scale(1);    opacity: 0.18; }
          50%       { transform: translateY(-22px) scale(1.15); opacity: 0.32; }
        }
        .hero-particle {
          background: rgba(230,57,70,0.55);
          animation: particleFloat var(--pdur, 7s) ease-in-out var(--pdelay, 0s) infinite;
        }

        /* ── Nav dot ── */
        .dot-btn { transition: all 0.25s ease; }
        .dot-btn:hover { transform: scale(1.2); }

        /* ── Arrow buttons ── */
        .hero-arrow {
          transition: background-color 0.2s ease, transform 0.2s ease;
        }
        .hero-arrow:hover {
          background-color: rgba(230,57,70,0.75) !important;
          transform: scale(1.1);
        }

        /* ── CTA buttons ── */
        .h-cta-primary {
          transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
        }
        .h-cta-primary:hover {
          background-color: #C0252E !important;
          transform: scale(1.03);
          box-shadow: 0 8px 28px rgba(230,57,70,0.4) !important;
        }
        .h-cta-ghost {
          transition: background-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
        }
        .h-cta-ghost:hover {
          background-color: rgba(255,255,255,0.22) !important;
          transform: scale(1.03);
        }
      `}</style>

      <section
        className="relative overflow-hidden h-screen"
        style={{ minHeight: 560 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* ── Previous slide (fading out) ── */}
        {prev !== null && (
          <div
            className="hero-bg hero-bg-exit"
            style={{ backgroundImage: `url(${SLIDES[prev].image})`, zIndex: 1 }}
          />
        )}

        {/* ── Active slide background ── */}
        <div
          key={active}
          className="hero-bg hero-bg-enter"
          style={{ backgroundImage: `url(${slide.image})`, zIndex: 2 }}
        />

        {/* ── Dark overlay ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 3, background: 'rgba(0,0,0,0.46)' }} />

        {/* ── Decorative green rays ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="hero-ray"
              style={{
                left:    `${4 + i * 5.5}%`,
                height:  `${28 + (i % 5) * 14}%`,
                '--dur':   `${2.8 + (i % 4) * 0.7}s`,
                '--delay': `${(i * 0.3) % 2.5}s`,
              }}
            />
          ))}
        </div>

        {/* ── Floating particles ── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
          {PARTICLES.map((p) => (
            <Particle
              key={p.id}
              style={{
                width: p.size, height: p.size,
                left: p.left, top: p.top,
                '--pdur':   p.dur,
                '--pdelay': p.delay,
              }}
            />
          ))}
        </div>

        {/* ── Hero content ── */}
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 10 }}
          className="flex items-center justify-center px-6 h-full"
        >
          <div key={active} className="w-full" style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

            {/* Badge ribbon */}
            <div className="hero-badge flex justify-center mb-5">
              <span style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #E63946 0%, #C0252E 100%)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                padding: '6px 22px',
                borderRadius: 4,
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                boxShadow: '0 4px 18px rgba(230,57,70,0.38)',
              }}>
                {slide.badge}
              </span>
            </div>

            {/* Heading */}
            <h1 className="hero-heading" style={{
              color: '#FFFFFF',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 16,
              textTransform: 'uppercase',
              textAlign: 'center',
              width: '100%',
            }}>
              <span className="block" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.2rem)' }}>
                {slide.heading[0]}
              </span>
              <span className="block" style={{
                fontSize: 'clamp(2.6rem, 6vw, 4.2rem)',
                WebkitTextStroke: '2px rgba(255,255,255,0.25)',
              }}>
                {slide.heading[1]}
              </span>
            </h1>

            {/* Tagline */}
            <p className="hero-tagline" style={{
              color: 'rgba(255,255,255,0.82)',
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 560,
              width: '100%',
              textAlign: 'center',
              margin: '0 auto 36px auto',
            }}>
              {slide.tagline}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-wrap items-center justify-center" style={{ gap: 16 }}>
              <Link
                to={slide.cta1.to}
                className="h-cta-primary flex items-center gap-2"
                style={{
                  height: 52, padding: '0 32px', borderRadius: 10,
                  backgroundColor: '#E63946', color: '#FFFFFF',
                  fontSize: 15, fontWeight: 700,
                  boxShadow: '0 6px 22px rgba(230,57,70,0.35)',
                }}
              >
                <UtensilsCrossed size={17} />
                {slide.cta1.label}
              </Link>
              <Link
                to={slide.cta2.to}
                className="h-cta-ghost flex items-center gap-2"
                style={{
                  height: 52, padding: '0 32px', borderRadius: 10,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  border: '1.5px solid rgba(255,255,255,0.72)',
                  color: '#FFFFFF', fontSize: 15, fontWeight: 700,
                }}
              >
                <Store size={17} />
                {slide.cta2.label}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Arrow controls ── */}
        <button
          className="hero-arrow hidden sm:flex items-center justify-center"
          onClick={prev_}
          style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          className="hero-arrow hidden sm:flex items-center justify-center"
          onClick={next}
          style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            zIndex: 20, width: 48, height: 48, borderRadius: '50%', border: 'none', cursor: 'pointer',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
          }}
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* ── Dot indicators ── */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          zIndex: 20, display: 'flex', gap: 10, alignItems: 'center',
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className="dot-btn"
              onClick={() => goTo(i)}
              style={{
                width: active === i ? 28 : 10,
                height: 10, borderRadius: 5, border: 'none', cursor: 'pointer',
                backgroundColor: active === i ? '#E63946' : 'rgba(255,255,255,0.45)',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* ── Scroll hint ── */}
        <div style={{
          position: 'absolute', bottom: 24, right: 32, zIndex: 20,
          color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: '1.5px',
          textTransform: 'uppercase', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
          className="hidden lg:flex"
        >
          <span>Scroll</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M7 13l-4-4M7 13l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
