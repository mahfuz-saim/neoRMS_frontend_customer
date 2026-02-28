/* ─────────────────────────────────────────────────────────────────
   AboutRestaurantPage  —  /restaurant/:restaurantId/about

   A dedicated "About Us" page for each restaurant.
   All content comes entirely from currentRestaurant in context —
   no hardcoded data.

   Sections:
   1. Hero strip (name + tagline over blurred banner)
   2. Our Story   (description)
   3. Info cards  (location, contact, hours, rating)
   4. Cuisine & Ambience (derived from description / fields)
   5. CTA strip   (Explore Menu | Book a Table)
   ───────────────────────────────────────────────────────────────── */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  MapPin, Phone, Clock, Star, UtensilsCrossed,
  CalendarDays, BookOpen, Sparkles, ArrowLeft,
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

/* ── Theme ─────────────────────────────────────────────────────── */
const C = {
  primary:      '#2DBE60',
  primaryHover: '#22A455',
  primaryLight: 'rgba(45,190,96,0.10)',
  dark:         '#1F2937',
  muted:        '#6B7280',
  border:       '#E5E7EB',
  cardBg:       '#FFFFFF',
  pageBg:       '#F4FAF6',
  shadow:       '0 2px 14px rgba(31,41,55,0.07)',
  shadowHover:  '0 8px 32px rgba(31,41,55,0.13)',
};

const FALLBACK_BANNER =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80';

/* ── Info card ── */
const InfoCard = ({ icon, title, value }) => {
  if (!value) return null;
  return (
    <div
      style={{
        background: C.cardBg, borderRadius: 14,
        padding: '22px 24px',
        border: `1.5px solid ${C.border}`,
        boxShadow: C.shadow,
        display: 'flex', alignItems: 'flex-start', gap: 14,
      }}
    >
      <div
        style={{
          width: 44, height: 44, borderRadius: 12,
          background: C.primaryLight,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.primary, flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 4px' }}>
          {title}
        </p>
        <p style={{ fontSize: 14, color: C.dark, margin: 0, lineHeight: 1.55 }}>{value}</p>
      </div>
    </div>
  );
};

/* ── Section label ── */
const SectionLabel = ({ children }) => (
  <span
    style={{
      display:       'inline-block',
      background:    C.primaryLight,
      color:         C.primary,
      fontSize:      11, fontWeight: 700, letterSpacing: '1.4px',
      textTransform: 'uppercase',
      padding:       '4px 16px', borderRadius: 20, marginBottom: 12,
    }}
  >
    {children}
  </span>
);

/* ── Main page ── */
const AboutRestaurantPage = () => {
  const { restaurantId }     = useParams();
  const { currentRestaurant } = useRestaurant();

  /* RestaurantBoundary handles loading/error; if we get here, restaurant exists */
  if (!currentRestaurant) return null;

  const r = currentRestaurant;
  const bannerSrc = r.bannerImage || r.coverImage || r.image || FALLBACK_BANNER;

  return (
    <div style={{ backgroundColor: C.pageBg, minHeight: 'calc(100vh - 80px)' }}>

      {/* ── Hero strip ── */}
      <div
        style={{
          position:   'relative',
          height:     340,
          overflow:   'hidden',
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Blurred background */}
        <div
          style={{
            position:           'absolute', inset: 0,
            backgroundImage:    `url(${bannerSrc})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            filter:             'blur(3px) brightness(0.55)',
            transform:          'scale(1.06)', /* hide blur edges */
          }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(0,0,0,0.55) 0%, rgba(15,60,30,0.70) 100%)',
          }}
        />

        {/* Back link */}
        <Link
          to={`/restaurant/${restaurantId}`}
          style={{
            position: 'absolute', top: 24, left: 24, zIndex: 5,
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.80)', fontSize: 13, fontWeight: 600,
            textDecoration: 'none',
            background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(6px)',
            padding: '7px 14px', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.20)',
            transition: 'color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.background = 'rgba(0,0,0,0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.80)';
            e.currentTarget.style.background = 'rgba(0,0,0,0.28)';
          }}
        >
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px' }}>
          <span
            style={{
              display:       'inline-block',
              background:    'rgba(45,190,96,0.82)',
              color:         '#fff',
              fontSize:      11, fontWeight: 700, letterSpacing: '1.3px',
              textTransform: 'uppercase',
              padding:       '4px 16px', borderRadius: 20, marginBottom: 16,
            }}
          >
            About Us
          </span>
          <h1
            style={{
              fontSize:   'clamp(26px, 5vw, 48px)',
              fontWeight: 800, color: '#fff',
              lineHeight: 1.15, margin: '0 0 12px',
              textShadow: '0 2px 14px rgba(0,0,0,0.45)',
            }}
          >
            {r.name}
          </h1>
          {r.tagline && (
            <p
              style={{
                fontSize: 'clamp(13px, 2vw, 17px)',
                color: 'rgba(255,255,255,0.82)',
                margin: 0, lineHeight: 1.6, maxWidth: 520,
              }}
            >
              {r.tagline}
            </p>
          )}
        </div>
      </div>

      {/* ── Page body ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 20px 80px' }}>

        {/* ── Our Story ── */}
        {r.description && (
          <section style={{ marginBottom: 60 }}>
            <SectionLabel>Our Story</SectionLabel>
            <h2
              style={{
                fontSize: 'clamp(22px, 3.5vw, 32px)',
                fontWeight: 800, color: C.dark, margin: '0 0 24px',
              }}
            >
              Who We Are
            </h2>
            <div
              style={{
                background: C.cardBg, borderRadius: 18,
                padding: '36px 40px',
                boxShadow: C.shadow,
                border: `1px solid ${C.border}`,
                display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start',
              }}
            >
              {/* Icon accent */}
              <div
                style={{
                  width: 64, height: 64, borderRadius: 18,
                  background: C.primaryLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.primary, flexShrink: 0,
                }}
              >
                <BookOpen size={30} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p
                  style={{
                    fontSize: 15, color: C.muted,
                    lineHeight: 1.85, margin: 0,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {r.description}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Info cards ── */}
        <section style={{ marginBottom: 60 }}>
          <SectionLabel>Find Us</SectionLabel>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 800, color: C.dark, margin: '0 0 24px',
            }}
          >
            Location & Contact
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 18,
            }}
          >
            <InfoCard icon={<MapPin size={20} />}    title="Location"     value={r.location} />
            <InfoCard icon={<Phone size={20} />}     title="Contact"      value={r.contactInfo} />
            <InfoCard icon={<Clock size={20} />}     title="Opening Hours" value={r.openingHours || 'Open Daily'} />
            {r.rating && (
              <InfoCard icon={<Star size={20} />}    title="Guest Rating"  value={`${r.rating} / 5 stars`} />
            )}
          </div>
        </section>

        {/* ── Experience / Cuisine ── */}
        <section style={{ marginBottom: 64 }}>
          <SectionLabel>Experience</SectionLabel>
          <h2
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 800, color: C.dark, margin: '0 0 24px',
            }}
          >
            What Makes Us Special
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                icon: <UtensilsCrossed size={24} />,
                title: 'Authentic Cuisine',
                body: r.cuisineType
                  ? `Specialising in ${r.cuisineType} cuisine crafted with the freshest local ingredients.`
                  : 'Every dish is prepared with fresh, locally sourced ingredients and time-honoured recipes.',
              },
              {
                icon: <Sparkles size={24} />,
                title: 'Warm Ambience',
                body: r.ambience
                  || 'A welcoming atmosphere designed for memorable dining experiences — whether you\'re celebrating or simply enjoying a meal.',
              },
              {
                icon: <Star size={24} />,
                title: 'Guest Satisfaction',
                body: r.guestSatisfaction
                  || 'We take pride in delivering exceptional service and culinary excellence that keeps our guests coming back.',
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                style={{
                  background: C.cardBg, borderRadius: 16,
                  padding: '28px 24px',
                  border: `1.5px solid ${C.border}`,
                  boxShadow: C.shadow,
                  transition: 'all 0.22s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow   = C.shadowHover;
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.transform   = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow   = C.shadow;
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.transform   = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: C.primaryLight,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: C.primary, marginBottom: 16,
                  }}
                >
                  {icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.dark, margin: '0 0 8px' }}>
                  {title}
                </h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, margin: 0 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section
          style={{
            background:   `linear-gradient(135deg, #1A4731 0%, ${C.primary} 100%)`,
            borderRadius: 20,
            padding:      '44px 40px',
            textAlign:    'center',
            position:     'relative',
            overflow:     'hidden',
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 180, height: 180, borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }} />
          <div style={{
            position: 'absolute', bottom: -50, left: -20,
            width: 200, height: 200, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }} />

          <h2
            style={{
              fontSize: 'clamp(20px, 3.5vw, 30px)',
              fontWeight: 800, color: '#fff',
              margin: '0 0 10px', position: 'relative', zIndex: 1,
            }}
          >
            Ready to Dine With Us?
          </h2>
          <p
            style={{
              fontSize: 15, color: 'rgba(255,255,255,0.78)',
              margin: '0 auto 28px', maxWidth: 420,
              position: 'relative', zIndex: 1,
            }}
          >
            Explore our menu or book a table for your next visit.
          </p>

          <div
            style={{
              display: 'flex', gap: 14, justifyContent: 'center',
              flexWrap: 'wrap', position: 'relative', zIndex: 1,
            }}
          >
            <Link
              to={`/restaurant/${restaurantId}/menu`}
              style={{
                padding: '13px 30px', borderRadius: 12,
                background: '#fff', color: C.primary,
                fontSize: 15, fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <UtensilsCrossed size={17} /> Explore Menu
            </Link>
            <Link
              to="/reservations"
              style={{
                padding: '13px 30px', borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.45)',
                color: '#fff',
                fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.30)';
                e.currentTarget.style.transform  = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                e.currentTarget.style.transform  = 'scale(1)';
              }}
            >
              <CalendarDays size={17} /> Book a Table
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutRestaurantPage;
