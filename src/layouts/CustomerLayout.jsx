import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header    from '../components/common/Header';
import Footer    from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';
import { theme } from '../theme/colors';

/* Single source of truth for nav height — consumed by layout padding,
   sticky tops, and scroll calculations via the CSS custom property. */
const NAV_H = 80;

const CustomerLayout = () => {
  const location = useLocation();
  return (
    <div
      className="flex flex-col"
      style={{
        /* CSS variable available to every descendant */
        '--nav-h': `${NAV_H}px`,
        backgroundColor: theme.colors.bg,
      }}
    >
      <Header />
      {/* paddingTop = nav height so content is never hidden under the fixed bar */}
      <main
        key={location.pathname}
        className="flex-grow w-full pb-8 page-enter"
        style={{ paddingTop: 'var(--nav-h)' }}
      >
        <Outlet />
      </main>
      <Footer />
      {/* Global auth modal — renders as overlay on top of any page */}
      <AuthModal />
    </div>
  );
};

export default CustomerLayout;
