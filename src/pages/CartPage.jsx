/* ─────────────────────────────────────────────────────────────────
   CartPage — two-column layout (items left, summary right).

   Desktop: 65 % items list  |  35 % sticky summary
   Mobile:  items stack → summary below

   Colors/shadows/radii match the existing site theme.
   ───────────────────────────────────────────────────────────────── */

import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useRestaurant } from '../context/RestaurantContext';

/* ── Theme ── */
const C = {
  primary:      '#E63946',
  primaryHover: '#C0252E',
  dark:         '#1F2937',
  muted:        '#6B7280',
  border:       '#E5E7EB',
  bg:           '#F4FAF6',
  cardBg:       '#FFFFFF',
  shadow:       '0 2px 14px rgba(31,41,55,0.07)',
  shadowStrong: '0 4px 24px rgba(31,41,55,0.10)',
};

const TAX_RATE    = 0.08;  // 8 %
const SERVICE_FEE = 1.99;

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useContext(CartContext);
  const navigate  = useNavigate();

  /* Detect active restaurant so empty-cart CTA goes to the right menu */
  const { currentRestaurant } = useRestaurant();
  const restaurantId = currentRestaurant?.id ?? currentRestaurant?._id ?? null;
  const menuLink = restaurantId ? `/restaurant/${restaurantId}/menu` : '/menu';

  const [coupon,    setCoupon   ] = useState('');
  const [couponOk,  setCouponOk ] = useState(false);
  const [couponErr, setCouponErr] = useState(false);

  const subtotal = cartTotal;
  const tax      = subtotal * TAX_RATE;
  const discount = couponOk ? subtotal * 0.10 : 0;
  const total    = subtotal + tax + SERVICE_FEE - discount;
  const isEmpty  = cart.length === 0;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'NEORMS10') {
      setCouponOk(true);
      setCouponErr(false);
    } else {
      setCouponOk(false);
      setCouponErr(true);
    }
  };

  return (
    <div
      style={{
        minHeight:       'calc(100vh - 80px)',
        backgroundColor: C.bg,
        padding:         '28px 16px 60px',
      }}
    >
      <style>{`
        .cp-qty-btn {
          width: 30px; height: 30px; border-radius: 8px;
          border: 1.5px solid ${C.border}; background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: ${C.dark}; flex-shrink: 0;
          transition: border-color 0.15s, background-color 0.15s;
        }
        .cp-qty-btn:hover { border-color: ${C.primary}; background: rgba(45,190,96,0.06); }
        .cp-remove-btn {
          border: none; background: none; cursor: pointer; padding: 6px 7px;
          border-radius: 8px; color: #9CA3AF;
          transition: color 0.15s, background-color 0.15s;
          display: flex; align-items: center;
        }
        .cp-remove-btn:hover { color: #EF4444; background: #FEF2F2; }
        .cp-checkout-btn {
          width: 100%; padding: 14px;
          background: ${C.primary}; color: #fff;
          border: none; border-radius: 11px;
          font-size: 15px; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background-color 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(45,190,96,0.30);
        }
        .cp-checkout-btn:hover:not(:disabled) {
          background: ${C.primaryHover}; transform: scale(1.01);
        }
        .cp-checkout-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
        .cp-coupon-input {
          flex: 1; padding: 10px 13px;
          border: 1.5px solid ${C.border}; border-radius: 9px;
          font-size: 14px; color: ${C.dark}; background: #fff; outline: none;
          transition: border-color 0.2s;
        }
        .cp-coupon-input:focus { border-color: ${C.primary}; }
        .cp-apply-btn {
          padding: 10px 16px; border-radius: 9px;
          background: ${C.primary}; color: #fff; border: none;
          font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap;
          transition: background-color 0.2s;
        }
        .cp-apply-btn:hover { background: ${C.primaryHover}; }
        @media (max-width: 740px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page title ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto 24px' }}>
        <h1 style={{
          fontSize: 24, fontWeight: 700, color: C.dark,
          margin: 0, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <ShoppingCart size={24} color={C.primary} />
          Your Cart
          {!isEmpty && (
            <span style={{ fontSize: 14, fontWeight: 500, color: C.muted, marginLeft: 4 }}>
              ({cart.length} {cart.length === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>
      </div>

      {/* ── Main content grid ── */}
      <div
        className="cart-grid"
        style={{
          maxWidth:            1100,
          margin:              '0 auto',
          display:             'grid',
          gridTemplateColumns: isEmpty ? '1fr' : 'minmax(0,1fr) 340px',
          gap:                 24,
          alignItems:          'start',
        }}
      >
        {/* ══════════════════════════════════════════
            LEFT — Cart items
           ══════════════════════════════════════════ */}
        <div>
          {isEmpty ? (
            <div style={{
              background: C.cardBg, borderRadius: 16, boxShadow: C.shadow,
              padding: '64px 32px', textAlign: 'center',
            }}>
              <ShoppingBag size={60} color="#D1D5DB" style={{ marginBottom: 18 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.dark, marginBottom: 8 }}>
                Your cart is empty
              </h2>
              <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>
                Browse our menu and add something delicious!
              </p>
              <button
                onClick={() => navigate(menuLink)}
                style={{
                  padding: '11px 28px', borderRadius: 10,
                  background: C.primary, color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(230,57,70,0.28)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.primaryHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.primary)}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  onRemove={removeFromCart}
                  onQty={updateQuantity}
                />
              ))}

              {/* Clear all */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 13, color: '#9CA3AF',
                    display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  <Trash2 size={13} /> Clear cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Order Summary (sticky)
           ══════════════════════════════════════════ */}
        {!isEmpty && (
          <div style={{ position: 'sticky', top: 96 }}>
            <div style={{
              background: C.cardBg, borderRadius: 16,
              boxShadow: C.shadowStrong, padding: '24px 22px',
            }}>
              <h2 style={{
                fontSize: 17, fontWeight: 700, color: C.dark,
                marginTop: 0, marginBottom: 20,
              }}>
                Order Summary
              </h2>

              <SummaryRow label="Subtotal"                         value={subtotal} />
              <SummaryRow label={`Tax (${Math.round(TAX_RATE*100)}%)`} value={tax} />
              <SummaryRow label="Service fee"                       value={SERVICE_FEE} />
              {couponOk && <SummaryRow label="Coupon (10 % off)" value={-discount} highlight />}

              <div style={{ height: 1, background: C.border, margin: '14px 0' }} />

              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 20,
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Coupon */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginBottom: 7 }}>
                  Have a coupon?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="cp-coupon-input"
                    placeholder="e.g. NEORMS10"
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponOk(false); setCouponErr(false); }}
                    onKeyDown={(e) => { if (e.key === 'Enter') applyCoupon(); }}
                  />
                  <button className="cp-apply-btn" onClick={applyCoupon}>Apply</button>
                </div>
                {couponOk && (
                  <p style={{ fontSize: 12, color: C.primary, marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Tag size={12} /> 10 % discount applied!
                  </p>
                )}
                {couponErr && (
                  <p style={{ fontSize: 12, color: '#EF4444', marginTop: 5 }}>
                    Invalid coupon code.
                  </p>
                )}
              </div>

              {/* Checkout CTA */}
              <button
                className="cp-checkout-btn"
                disabled={isEmpty}
                onClick={() => navigate('/order-review')}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>

              {/* Continue shopping */}
              <button
                onClick={() => navigate('/menu')}
                style={{
                  width: '100%', marginTop: 10, padding: 10,
                  background: 'none', border: `1.5px solid ${C.border}`,
                  borderRadius: 11, fontSize: 13, fontWeight: 500,
                  color: C.muted, cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = C.primary;
                  e.currentTarget.style.color = C.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = C.border;
                  e.currentTarget.style.color = C.muted;
                }}
              >
                + Add more items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Cart Item Card ──────────────────────────────────────────────── */
const CartItemCard = ({ item, onRemove, onQty }) => (
  <div style={{
    background: '#fff', borderRadius: 14,
    boxShadow: '0 2px 12px rgba(31,41,55,0.07)',
    padding: 14, display: 'flex', alignItems: 'center', gap: 14,
  }}>
    {/* Thumbnail */}
    <div style={{
      width: 80, height: 80, borderRadius: 10, flexShrink: 0,
      overflow: 'hidden', background: '#F3F4F6',
    }}>
      {item.image ? (
        <img
          src={item.image} alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShoppingBag size={28} color="#D1D5DB" />
        </div>
      )}
    </div>

    {/* Info */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{
        fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 2px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {item.name}
      </p>
      {item.category && (
        <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 8px' }}>
          {item.category}
        </p>
      )}
      <p style={{ fontSize: 14, fontWeight: 700, color: '#E63946', margin: 0 }}>
        ${(item.price * (item.quantity ?? 1)).toFixed(2)}
      </p>
    </div>

    {/* Qty stepper + remove */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <button
        className="cp-qty-btn"
        onClick={() => onQty(item.id, (item.quantity ?? 1) - 1)}
        aria-label="Decrease quantity"
      >
        <Minus size={13} />
      </button>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', minWidth: 20, textAlign: 'center' }}>
        {item.quantity ?? 1}
      </span>
      <button
        className="cp-qty-btn"
        onClick={() => onQty(item.id, (item.quantity ?? 1) + 1)}
        aria-label="Increase quantity"
      >
        <Plus size={13} />
      </button>
      <button
        className="cp-remove-btn"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

/* ── Summary Row ─────────────────────────────────────────────────── */
const SummaryRow = ({ label, value, highlight }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  }}>
    <span style={{ fontSize: 14, color: '#6B7280' }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 600, color: highlight ? '#E63946' : '#1F2937' }}>
      {value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`}
    </span>
  </div>
);

export default CartPage;
