/* ─────────────────────────────────────────────────────────────────
   SignUpPage — customer registration form.

   Rules enforced here:
   • Fields: fullName, email, password
   • Calls POST /user/signup via AuthContext.signup()
   • 409 → shows "Email already in use" inline
   • On success → AuthContext redirects to /sign-in with registered:true flag
   • No front-end email-existence check; backend is the source of truth
   ───────────────────────────────────────────────────────────────── */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Theme ── */
const C = {
  primary:      '#2DBE60',
  primaryHover: '#22A455',
  dark:         '#1F2937',
  gray:         '#6B7280',
  border:       '#E5E7EB',
  error:        '#EF4444',
  bg:           '#F9FAFB',
};

const SignUpPage = () => {
  const { signup } = useAuth();

  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPass,  setShowPass ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState('');
  const [fieldError, setFieldError] = useState({});   // per-field inline errors

  const handleChange = (e) => {
    setError('');
    setFieldError((prev) => ({ ...prev, [e.target.name]: '' }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.email.trim())    errs.email    = 'Email is required.';
    if (!form.password)        errs.password = 'Password is required.';
    if (Object.keys(errs).length) { setFieldError(errs); return; }

    setIsLoading(true);
    setError('');
    setFieldError({});

    try {
      /* signup() calls POST /user/signup, then redirects to /sign-in on success */
      await signup({
        fullName: form.fullName.trim(),
        email:    form.email.trim(),
        password: form.password,
        role:     'CUSTOMER',
      });
    } catch (err) {
      const status = err?.status;
      if (status === 409) {
        // Backend says email is already registered
        setFieldError({ email: 'Email already in use. Try signing in instead.' });
      } else if (status === 422 || status === 400) {
        setError(err.message || 'Please check your details and try again.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight:       'calc(100vh - 80px)',
        backgroundColor: C.bg,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '24px 16px',
      }}
    >
      <style>{`
        .su-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid ${C.border}; border-radius: 10px;
          font-size: 15px; color: ${C.dark}; background: #fff;
          outline: none; transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .su-input:focus { border-color: ${C.primary}; }
        .su-input.su-field-error { border-color: ${C.error}; }
        .su-field-msg {
          margin-top: 5px; font-size: 13px; color: ${C.error};
        }
        .su-btn-primary {
          width: 100%; padding: 12px;
          background: ${C.primary}; color: #fff;
          border: none; border-radius: 10px;
          font-size: 16px; font-weight: 600;
          cursor: pointer; display: flex; align-items: center;
          justify-content: center; gap: 8px;
          transition: background-color 0.2s, transform 0.15s;
        }
        .su-btn-primary:hover:not(:disabled) {
          background: ${C.primaryHover}; transform: scale(1.01);
        }
        .su-btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .su-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          animation: su-spin 0.7s linear infinite;
        }
        @keyframes su-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        style={{
          width:        '100%',
          maxWidth:     '440px',
          background:   '#fff',
          borderRadius: '16px',
          boxShadow:    '0 4px 24px rgba(0,0,0,0.08)',
          padding:      '40px 36px',
        }}
      >
        {/* Logo / brand */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              width:          '52px',
              height:         '52px',
              borderRadius:   '14px',
              background:     `${C.primary}18`,
              marginBottom:   '12px',
            }}
          >
            <Utensils size={26} color={C.primary} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: C.dark, margin: '0 0 4px' }}>
            Create an account
          </h1>
          <p style={{ fontSize: '14px', color: C.gray, margin: 0 }}>
            Sign up to order food and make reservations
          </p>
        </div>

        {/* Global error banner */}
        {error && (
          <div
            role="alert"
            style={{
              background:   '#FEF2F2',
              border:       '1px solid #FCA5A5',
              borderRadius: '8px',
              padding:      '10px 14px',
              marginBottom: '18px',
              fontSize:     '14px',
              color:        C.error,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="fullName"
              style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: C.dark, marginBottom: '6px' }}
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={handleChange}
              className={`su-input${fieldError.fullName ? ' su-field-error' : ''}`}
              disabled={isLoading}
            />
            {fieldError.fullName && (
              <p className="su-field-msg">{fieldError.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="email"
              style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: C.dark, marginBottom: '6px' }}
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className={`su-input${fieldError.email ? ' su-field-error' : ''}`}
              disabled={isLoading}
            />
            {fieldError.email && (
              <p className="su-field-msg">{fieldError.email}</p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: C.dark, marginBottom: '6px' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={handleChange}
                className={`su-input${fieldError.password ? ' su-field-error' : ''}`}
                style={{ paddingRight: '44px' }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={{
                  position:   'absolute',
                  right:      '12px',
                  top:        '50%',
                  transform:  'translateY(-50%)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    '4px',
                  color:      C.gray,
                  display:    'flex',
                  alignItems: 'center',
                }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldError.password && (
              <p className="su-field-msg">{fieldError.password}</p>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="su-btn-primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="su-spinner" />
                Creating account…
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '14px', color: C.gray, marginTop: '20px', marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/sign-in" style={{ color: C.primary, fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>

        <p style={{ textAlign: 'center', fontSize: '13px', color: C.gray, marginTop: '8px', marginBottom: 0 }}>
          <Link to="/" style={{ color: C.gray, textDecoration: 'underline' }}>
            Continue browsing the menu
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
