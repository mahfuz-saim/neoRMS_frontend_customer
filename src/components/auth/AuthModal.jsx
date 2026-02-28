/* ─────────────────────────────────────────────────────────────────
   AuthModal — Sign In / Sign Up as a centered overlay modal.

   • Sits on top of any page — background stays visible + dimmed.
   • Controlled entirely by AuthContext (authModalOpen / closeAuthModal).
   • Tabs let the user switch between Sign In and Sign Up without
     leaving the modal or the current page.
   • On successful login the modal closes; user stays where they were.
   • On successful signup the modal switches to the Sign In tab with a
     success banner.
   ───────────────────────────────────────────────────────────────── */

import React, { useCallback, useEffect, useState } from 'react';
import { Eye, EyeOff, LogIn, UserPlus, X, Utensils } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ── Theme (matches existing site palette) ──────────────────────── */
const C = {
  primary:      '#2DBE60',
  primaryHover: '#22A455',
  dark:         '#1F2937',
  gray:         '#6B7280',
  border:       '#E5E7EB',
  error:        '#EF4444',
};

/* ── Shared input CSS class names injected once ─────────────────── */
const STYLES = `
  .am-input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid ${C.border}; border-radius: 9px;
    font-size: 14px; color: ${C.dark}; background: #fff;
    outline: none; transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .am-input:focus { border-color: ${C.primary}; }
  .am-input.am-err { border-color: ${C.error}; }
  .am-btn {
    width: 100%; padding: 11px;
    background: ${C.primary}; color: #fff;
    border: none; border-radius: 9px;
    font-size: 15px; font-weight: 600;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; gap: 8px;
    transition: background-color 0.2s, transform 0.15s;
  }
  .am-btn:hover:not(:disabled) { background: ${C.primaryHover}; transform: scale(1.01); }
  .am-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .am-tab {
    flex: 1; padding: 9px 0; font-size: 14px; font-weight: 600;
    border: none; background: none; cursor: pointer; border-radius: 8px;
    transition: color 0.2s, background-color 0.2s;
  }
  .am-tab.active { background: ${C.primary}; color: #fff; }
  .am-tab:not(.active) { color: ${C.gray}; }
  .am-tab:not(.active):hover { color: ${C.dark}; }
  .am-spinner {
    width: 17px; height: 17px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.35); border-top-color: #fff;
    animation: am-spin 0.7s linear infinite;
  }
  @keyframes am-spin { to { transform: rotate(360deg); } }
  @keyframes am-overlay-in  { from { opacity:0 } to { opacity:1 } }
  @keyframes am-card-in {
    from { opacity:0; transform: scale(0.93) translateY(28px) }
    to   { opacity:1; transform: scale(1)    translateY(0)    }
  }
`;

/* ── Reusable field error message ───────────────────────────────── */
const FieldErr = ({ msg }) =>
  msg ? <p style={{ marginTop: 4, fontSize: 12, color: C.error }}>{msg}</p> : null;

/* ── Sign In Form ───────────────────────────────────────────────── */
const SignInForm = ({ onSuccess }) => {
  const { login, switchAuthModalTab } = useAuth();
  const [form,      setForm     ] = useState({ email: '', password: '' });
  const [showPass,  setShowPass ] = useState(false);
  const [loading,   setLoading  ] = useState(false);
  const [error,     setError    ] = useState('');

  const onChange = (e) => {
    setError('');
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    try {
      // redirectTo = null → modal closes, user stays on current page
      await login({ email: form.email, password: form.password }, null);
      onSuccess?.();
    } catch (err) {
      const s = err?.status;
      setError(
        s === 401 || s === 400 ? (err.message || 'Invalid email or password.')
        : s === 422           ? (err.message || 'Please check your email format.')
        : (err.message || 'Something went wrong. Please try again.'),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 7,
          padding: '9px 13px', marginBottom: 14, fontSize: 13, color: C.error,
        }} role="alert">{error}</div>
      )}

      <div style={{ marginBottom: 13 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 5 }}>
          Email address
        </label>
        <input id="am-email" name="email" type="email" autoComplete="email"
          placeholder="you@example.com" value={form.email} onChange={onChange}
          className={`am-input${error ? ' am-err' : ''}`} disabled={loading} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 5 }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input id="am-password" name="password" type={showPass ? 'text' : 'password'}
            autoComplete="current-password" placeholder="••••••••"
            value={form.password} onChange={onChange}
            className={`am-input${error ? ' am-err' : ''}`}
            style={{ paddingRight: 42 }} disabled={loading} />
          <button type="button" onClick={() => setShowPass((s) => !s)}
            style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: C.gray,
              display: 'flex', alignItems: 'center', padding: 3 }}
            aria-label={showPass ? 'Hide password' : 'Show password'}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button type="submit" className="am-btn" disabled={loading}>
        {loading ? <><span className="am-spinner" />Signing in…</> : <><LogIn size={16} />Sign In</>}
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: C.gray, marginTop: 16, marginBottom: 0 }}>
        No account?{' '}
        <button type="button" onClick={() => switchAuthModalTab('signup')}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: C.primary, fontWeight: 600, fontSize: 13, padding: 0 }}>
          Sign Up
        </button>
      </p>
    </form>
  );
};

/* ── Sign Up Form ───────────────────────────────────────────────── */
const SignUpForm = () => {
  const { signup, switchAuthModalTab } = useAuth();
  const [form,       setForm      ] = useState({ fullName: '', email: '', password: '' });
  const [showPass,   setShowPass  ] = useState(false);
  const [loading,    setLoading   ] = useState(false);
  const [error,      setError     ] = useState('');
  const [fieldErr,   setFieldErr  ] = useState({});
  const [registered, setRegistered] = useState(false);

  const onChange = (e) => {
    setError(''); setFieldErr((p) => ({ ...p, [e.target.name]: '' }));
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.trim())    errs.email    = 'Email is required.';
    if (!form.password)        errs.password = 'Password is required.';
    if (Object.keys(errs).length) { setFieldErr(errs); return; }

    setLoading(true); setError(''); setFieldErr({});
    try {
      // fromModal = true → switches tab to sign-in instead of navigating
      await signup({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        password: form.password,
        role:     'CUSTOMER',
      }, true);
      setRegistered(true);
    } catch (err) {
      const s = err?.status;
      if (s === 409) setFieldErr({ email: 'Email already in use. Try signing in.' });
      else if (s === 400 || s === 422) setError(err.message || 'Please check your details.');
      else setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0' }}>
        <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 8,
          padding: '14px', marginBottom: 18, fontSize: 14, color: '#166534' }}>
          🎉 Account created! Please sign in.
        </div>
        <button className="am-btn" onClick={() => switchAuthModalTab('signin')}>
          <LogIn size={16} /> Go to Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 7,
          padding: '9px 13px', marginBottom: 14, fontSize: 13, color: C.error }}
          role="alert">{error}</div>
      )}

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 5 }}>
          Full name
        </label>
        <input name="fullName" type="text" autoComplete="name" placeholder="Jane Doe"
          value={form.fullName} onChange={onChange}
          className={`am-input${fieldErr.fullName ? ' am-err' : ''}`} disabled={loading} />
        <FieldErr msg={fieldErr.fullName} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 5 }}>
          Email address
        </label>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com"
          value={form.email} onChange={onChange}
          className={`am-input${fieldErr.email ? ' am-err' : ''}`} disabled={loading} />
        <FieldErr msg={fieldErr.email} />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: C.dark, marginBottom: 5 }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input name="password" type={showPass ? 'text' : 'password'}
            autoComplete="new-password" placeholder="Min. 8 characters"
            value={form.password} onChange={onChange}
            className={`am-input${fieldErr.password ? ' am-err' : ''}`}
            style={{ paddingRight: 42 }} disabled={loading} />
          <button type="button" onClick={() => setShowPass((s) => !s)}
            style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: C.gray,
              display: 'flex', alignItems: 'center', padding: 3 }}
            aria-label={showPass ? 'Hide password' : 'Show password'}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <FieldErr msg={fieldErr.password} />
      </div>

      <button type="submit" className="am-btn" disabled={loading}>
        {loading ? <><span className="am-spinner" />Creating account…</> : <><UserPlus size={16} />Create Account</>}
      </button>

      <p style={{ textAlign: 'center', fontSize: 13, color: C.gray, marginTop: 16, marginBottom: 0 }}>
        Already have an account?{' '}
        <button type="button" onClick={() => switchAuthModalTab('signin')}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: C.primary, fontWeight: 600, fontSize: 13, padding: 0 }}>
          Sign In
        </button>
      </p>
    </form>
  );
};

/* ── AuthModal (root) ───────────────────────────────────────────── */
const AuthModal = () => {
  const { authModalOpen, authModalTab, switchAuthModalTab, closeAuthModal } = useAuth();

  /* Lock body scroll while open */
  useEffect(() => {
    if (authModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [authModalOpen]);

  /* Close on Escape */
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') closeAuthModal(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [closeAuthModal]);

  if (!authModalOpen) return null;

  return (
    <>
      <style>{STYLES}</style>

      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        style={{
          position:           'fixed', inset: 0, zIndex: 2000,
          backgroundColor:    'rgba(17,24,39,0.60)',
          backdropFilter:     'blur(5px)',
          WebkitBackdropFilter:'blur(5px)',
          display:            'flex',
          alignItems:         'center',
          justifyContent:     'center',
          padding:            '16px',
          animation:          'am-overlay-in 0.22s ease forwards',
        }}
      >
        {/* Card */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={authModalTab === 'signin' ? 'Sign In' : 'Sign Up'}
          style={{
            width:        '100%',
            maxWidth:     '420px',
            background:   '#fff',
            borderRadius: '18px',
            boxShadow:    '0 32px 80px rgba(0,0,0,0.22)',
            padding:      '32px 28px',
            position:     'relative',
            animation:    'am-card-in 0.28s cubic-bezier(.4,0,.2,1) forwards',
          }}
        >
          {/* Close button */}
          <button
            onClick={closeAuthModal}
            aria-label="Close"
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 34, height: 34, borderRadius: '50%',
              background: '#F3F4F6', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.gray, transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
          >
            <X size={16} />
          </button>

          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(45,190,96,0.10)', marginBottom: 10,
            }}>
              <Utensils size={22} color={C.primary} />
            </div>
            <h2 style={{ fontSize: 19, fontWeight: 700, color: C.dark, margin: 0 }}>
              GreenBite
            </h2>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: 'flex', gap: 4, background: '#F3F4F6',
            borderRadius: 10, padding: 4, marginBottom: 22,
          }}>
            <button
              type="button"
              className={`am-tab${authModalTab === 'signin' ? ' active' : ''}`}
              onClick={() => switchAuthModalTab('signin')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`am-tab${authModalTab === 'signup' ? ' active' : ''}`}
              onClick={() => switchAuthModalTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {authModalTab === 'signin'
            ? <SignInForm />
            : <SignUpForm />
          }
        </div>
      </div>
    </>
  );
};

export default AuthModal;
