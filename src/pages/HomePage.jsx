import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Clock, MapPin, UtensilsCrossed } from 'lucide-react';
import HeroSection from '../components/common/HeroSection';

/* ── Quick action cards (Home page — discovery only) ── */
const quickActions = [
  { to: '/restaurants', icon: <Store size={32} />, label: 'Explore Restaurants', desc: 'Discover all restaurants near you' },
];

/* ── Why-us stats ── */
const stats = [
  { icon: <Star size={22} />,            value: '4.9',    label: 'Average Rating' },
  { icon: <Clock size={22} />,           value: '18 min', label: 'Avg. Delivery' },
  { icon: <MapPin size={22} />,          value: '3',      label: 'Locations' },
  { icon: <UtensilsCrossed size={22} />, value: '80+',    label: 'Menu Items' },
];

const HomePage = () => (
  <>
    {/* ── Full-viewport Hero ── */}
    <div style={{ marginTop: -80 }}>
      <HeroSection />
    </div>

    {/* ── Page content ── */}
    <div className="px-6 lg:px-12 xl:px-20 2xl:px-32 py-16 space-y-16 max-w-[1400px] mx-auto">

      {/* Single prominent CTA */}
      <section className="flex justify-center">
        <Link
          to="/restaurants"
          className="group flex flex-col items-center text-center rounded-2xl p-10 border bg-white transition-all duration-200 hover:shadow-xl hover:-translate-y-1"
          style={{ borderColor: '#E5E7EB', textDecoration: 'none', maxWidth: 320, width: '100%' }}
        >
          <div
            className="flex items-center justify-center mb-5 rounded-full transition-all duration-200 group-hover:scale-110"
            style={{ width: 80, height: 80, backgroundColor: 'rgba(45,190,96,0.1)', color: '#2DBE60' }}
          >
            <Store size={36} />
          </div>
          <h3 style={{ color: '#1F2937', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Explore Restaurants</h3>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.5 }}>Discover all restaurants, browse menus and place your order.</p>
        </Link>
      </section>

      {/* Stats ribbon */}
      <section
        className="rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-0 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2DBE60 0%, #1a9e4e 100%)' }}
      >
        {stats.map(({ icon, value, label }, i) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center py-10 px-4 text-center"
            style={{
              borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.18)' : 'none',
            }}
          >
            <div className="mb-2" style={{ color: 'rgba(255,255,255,0.8)' }}>{icon}</div>
            <div className="font-800 text-3xl text-white mb-1" style={{ fontWeight: 800 }}>{value}</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, letterSpacing: '0.4px' }}>{label}</div>
          </div>
        ))}
      </section>

    </div>
  </>
);

export default HomePage;

