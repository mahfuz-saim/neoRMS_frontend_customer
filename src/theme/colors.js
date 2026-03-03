/* ═══════════════════════════════════════════════════════════════════
   neoRMS — Centralized Theme System
   Active theme: Warm Tomato & Charcoal

   All color, typography, spacing, radius, and shadow tokens live here.
   Swap the active palette comment below to change the entire app's look.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Palette definitions ─────────────────────────────────────────── */
const palettes = {

  /* ① Warm Tomato & Charcoal  ← ACTIVE
     Role              Token         Value
     Primary/Brand     primary       #E63946  Tomato Red — buttons, main actions
     Accent/Highlight  highlight     #F95738  Bright Orange-Red — hover, badges
     Dark Text         dark          #2B2D42  Charcoal — headings & body
     Secondary         secondary     #F77F00  Warm Orange — icons, secondary CTAs
     Card Background   cardBg        #FFFFFF  Pure white
     Page Background   bg            #FFF5F3  Soft warm — subtle warmth
  */
  tomato: {
    primary:       '#E63946',                          // Tomato Red — CTAs, active states
    primaryHover:  '#C0252E',                          // Deeper tomato — hover
    highlight:     '#F95738',                          // Bright Orange-Red — badges, accents
    secondary:     '#F77F00',                          // Warm Orange — icons, secondary CTAs
    dark:          '#2B2D42',                          // Charcoal — headings & body text
    muted:         '#6B7280',                          // Neutral gray — secondary text
    border:        '#FFD5D0',                          // Soft rose — dividers, card borders
    bg:            '#FFF5F3',                          // Soft warm — page background
    neutralLight:  '#FFF5F3',                          // Same soft warm — section backgrounds
    cardBg:        '#FFFFFF',                          // Pure white — cards
    coolAccent:    '#5B86E5',                          // Indigo-blue — decorative pops
    navBg:         '#FFFFFF',                          // Navbar background
    cartBg:        '#FFF1EE',                          // Icon button fill
    cartHover:     '#FFD5D0',                          // Icon button hover fill
    errorRed:      '#EF4444',
  },

  /* ② Previous Tomato palette (archived) */
  // tomatoV1: {
  //   primary:      '#E63946',
  //   primaryHover: '#C0252E',
  //   highlight:    '#F95738',
  //   dark:         '#2B2D42',
  //   muted:        '#6B7280',
  //   border:       '#FFD5D0',
  //   bg:           '#FFF5F3',
  //   neutralLight: '#FFF5F3',
  //   cardBg:       '#FFFFFF',
  //   coolAccent:   '#5B86E5',
  //   navBg:        '#FFFFFF',
  //   cartBg:       '#FFF1EE',
  //   cartHover:    '#FFD5D0',
  //   errorRed:     '#EF4444',
  // },

  /* ③ Classic Greens (legacy) */
  // green: {
  //   primary:      '#2DBE60',
  //   primaryHover: '#22A455',
  //   highlight:    '#16A34A',
  //   dark:         '#1F2937',
  //   muted:        '#6B7280',
  //   border:       '#E5E7EB',
  //   bg:           '#F4FAF6',
  //   neutralLight: '#F9FAFB',
  //   cardBg:       '#FFFFFF',
  //   coolAccent:   '#3B82F6',
  //   navBg:        '#FFFFFF',
  //   cartBg:       '#F3F4F6',
  //   cartHover:    '#E5E7EB',
  //   errorRed:     '#EF4444',
  // },
};

/* ── Active palette ─────────────────────────────────────────────── */
const p = palettes.tomato;

/* ── Design tokens (consumed by all components) ─────────────────── */
export const theme = {

  colors: {
    ...p,
    shadow:      `0 2px 14px rgba(230,57,70,0.10)`,
    shadowHover: `0 8px 32px rgba(230,57,70,0.18)`,
    ctaShadow:   `0px 6px 20px rgba(230,57,70,0.30)`,
    navShadow:   `0 2px 16px rgba(0,0,0,0.08)`,
  },

  typography: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    sizes: {
      xs:    11,
      sm:    12,
      base:  14,
      md:    15,
      lg:    17,
      xl:    20,
      '2xl': 26,
      '3xl': 32,
    },
    weights: {
      normal:    400,
      medium:    500,
      semibold:  600,
      bold:      700,
      extrabold: 800,
    },
  },

  spacing: {
    xs:    4,
    sm:    8,
    md:    16,
    lg:    24,
    xl:    32,
    '2xl': 48,
    '3xl': 64,
  },

  radii: {
    sm:   6,
    md:   10,
    lg:   16,
    xl:   20,
    pill: 999,
  },

  shadows: {
    sm:        '0 1px 4px rgba(0,0,0,0.06)',
    md:        '0 2px 14px rgba(230,57,70,0.10)',
    lg:        '0 8px 32px rgba(230,57,70,0.18)',
    card:      '0 2px 14px rgba(230,57,70,0.10)',
    cardHover: '0 8px 32px rgba(230,57,70,0.18)',
    cta:       '0px 6px 20px rgba(230,57,70,0.30)',
    navbar:    '0 2px 16px rgba(0,0,0,0.08)',
  },
};

/* ── Legacy export kept for backward-compat ─────────────────────── */
export const colors = { ...palettes };

export default theme;
