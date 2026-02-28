import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header    from '../components/common/Header';
import Footer    from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';

const CustomerLayout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <Header />
      {/* key= re-mounts main on every route change, triggering page-enter animation */}
      <main key={location.pathname} className="flex-grow w-full pt-[80px] pb-8 page-enter">
        <Outlet />
      </main>
      <Footer />
      {/* Global auth modal — renders as overlay on top of any page */}
      <AuthModal />
    </div>
  );
};

export default CustomerLayout;
