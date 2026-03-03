/* ─────────────────────────────────────────────────────────────────
   ProtectedRoute — wraps routes that require authentication.

   Behaviour:
   • loading        → centered spinner while auth bootstraps.
   • authenticated  → renders <Outlet /> normally.
   • unauthenticated → navigates to "/" and opens the Sign In modal
                       so the user never lands on a blank/error page.
   ───────────────────────────────────────────────────────────────── */

import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AUTH_STATUS, useAuth } from '../../context/AuthContext';

/* Tiny helper that just triggers side-effects then renders nothing */
const UnauthGuard = () => {
  const { openAuthModal } = useAuth();
  const navigate          = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
    openAuthModal('signin');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};

const ProtectedRoute = () => {
  const { status } = useAuth();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
        }}
      >
        <div style={{
          width: '40px', height: '40px', borderRadius: '50%',
          border: '3px solid #E5E7EB', borderTopColor: '#E63946',
          animation: 'spin 0.75s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === AUTH_STATUS.UNAUTHENTICATED) {
    return <UnauthGuard />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
