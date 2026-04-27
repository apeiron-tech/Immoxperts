/**
 * Propsight — Tailwind config (V1)
 * ─────────────────────────────────────────────────────────
 * Place this file at the root of your `webapp/` Maven module
 * (same level as `package.json`). The webpack/Tailwind PostCSS
 * pipeline will pick it up automatically.
 *
 * What this fixes vs. today:
 *  - There was NO tailwind.config.js in the repo, so every
 *    `bg-violet-500`, `bg-propsight-500`, `shadow-float-sm`
 *    in the code was either falling back to Tailwind defaults
 *    (wrong purple) or rendering as nothing (no shadow).
 *  - The "propsight" palette in the OLD config (uploads/) was
 *    off-spec. This one is calibrated to the design system:
 *    primary `--ps-violet-500 = #7A6AF5`.
 *  - Adds the full token surface: neutrals (warm), semantic,
 *    type scale, spacing, radii, motion.
 * ───────────────────────────────────────────────────────── */

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Toggled by adding `class="dark"` on <html>
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Preserved from previous config — used by `.text-accent` and gradient utilities
        accent: 'hsl(var(--accent))',

        // ── Primary (violet) — single source of truth ──────
        propsight: {
          50:  '#F4F1FE',
          100: '#E7E1FD',
          200: '#CFC4FB',
          300: '#A99AF7',
          400: '#8E7CF2',
          500: '#7A6AF5', // ← brand primary
          600: '#6553E8',
          700: '#5340C9',
          800: '#3F309D',
          900: '#2A2070',
        },
        // Alias so the existing `bg-violet-*` classes keep working
        // and converge to the brand palette. Remove after migration.
        violet: {
          50:  '#F4F1FE',
          100: '#E7E1FD',
          200: '#CFC4FB',
          300: '#A99AF7',
          400: '#8E7CF2',
          500: '#7A6AF5',
          600: '#6553E8',
          700: '#5340C9',
          800: '#3F309D',
          900: '#2A2070',
        },

        // ── Neutrals (warm cream/ink) — replaces slate/gray ─
        neutral: {
          50:  '#F8F7F4', // app background (warm cream)
          100: '#EFEEEA',
          200: '#E2E0DA', // hairline borders
          300: '#C9C6BD',
          400: '#9D998E',
          500: '#6F6C64',
          600: '#4F4D47',
          700: '#3A3833',
          800: '#26241F',
          900: '#14130F', // ink / fg-1
        },
        // Aliases — same warm scale under the legacy slate/gray names
        slate: {
          50:  '#F8F7F4', 100: '#EFEEEA', 200: '#E2E0DA', 300: '#C9C6BD',
          400: '#9D998E', 500: '#6F6C64', 600: '#4F4D47', 700: '#3A3833',
          800: '#26241F', 900: '#14130F',
        },
        gray: {
          50:  '#F8F7F4', 100: '#EFEEEA', 200: '#E2E0DA', 300: '#C9C6BD',
          400: '#9D998E', 500: '#6F6C64', 600: '#4F4D47', 700: '#3A3833',
          800: '#26241F', 900: '#14130F',
        },

        // ── Semantic ───────────────────────────────────────
        success: { 50: '#E6F6EB', 100: '#CCEDD7', 500: '#0E8B4A', 700: '#0A6537' },
        warning: { 50: '#FFF4D6', 100: '#FFE7A6', 500: '#B66E12', 700: '#8A5108' },
        danger:  { 50: '#FDE6EC', 100: '#FBCCD7', 500: '#A3263A', 700: '#7A1A2C' },
        info:    { 50: '#E6F0FA', 100: '#CCE0F4', 500: '#1F6FB8', 700: '#175489' },

        // Tailwind aliases that map onto the same scales above
        emerald: { 50: '#E6F6EB', 100: '#CCEDD7', 500: '#0E8B4A', 600: '#0C7841', 700: '#0A6537' },
        rose:    { 50: '#FDE6EC', 100: '#FBCCD7', 500: '#A3263A', 600: '#921F33', 700: '#7A1A2C' },
        amber:   { 50: '#FFF4D6', 100: '#FFE7A6', 500: '#B66E12', 600: '#9C5D0E', 700: '#8A5108' },
      },

      // ── Typography ───────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Functional scale — use these named sizes, not arbitrary [13.5px]
        'caption':  ['10.5px', { lineHeight: '14px',  letterSpacing: '0.04em' }],
        'micro':    ['11px',   { lineHeight: '14px' }],
        'small':    ['12px',   { lineHeight: '16px' }],
        'body':     ['13px',   { lineHeight: '18px' }],
        'body-lg':  ['14px',   { lineHeight: '20px' }],
        'lead':     ['15px',   { lineHeight: '22px' }],
        'title':    ['18px',   { lineHeight: '24px', letterSpacing: '-0.005em' }],
        'h3':       ['22px',   { lineHeight: '28px', letterSpacing: '-0.01em'  }],
        'h2':       ['28px',   { lineHeight: '34px', letterSpacing: '-0.015em' }],
        'h1':       ['36px',   { lineHeight: '42px', letterSpacing: '-0.02em'  }],
        'display':  ['44px',   { lineHeight: '50px', letterSpacing: '-0.025em' }],
      },

      // ── Spacing (4-pt grid + functional aliases) ─────────
      spacing: {
        '4.5': '18px',
        '13':  '52px',  // header/topbar height
        '15':  '60px',
        '18':  '72px',
        '22':  '88px',
        '50':  '200px',
        '60':  '240px', // sidebar width
        '70':  '280px',
        '88':  '352px', // drawer width
        '100': '400px',
      },

      // ── Radii ────────────────────────────────────────────
      borderRadius: {
        'xs': '3px',
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
      },

      // ── Shadows (single ladder — replaces float-/map-/subtle) ──
      boxShadow: {
        'xs':      '0 1px 2px rgba(20,22,42,0.04)',
        'sm':      '0 1px 3px rgba(20,22,42,0.06), 0 1px 2px rgba(20,22,42,0.04)',
        'md':      '0 4px 12px -2px rgba(20,22,42,0.08), 0 2px 4px rgba(20,22,42,0.04)',
        'lg':      '0 12px 28px -8px rgba(20,22,42,0.12), 0 4px 8px -4px rgba(20,22,42,0.06)',
        'xl':      '0 24px 48px -12px rgba(20,22,42,0.16), 0 8px 16px -8px rgba(20,22,42,0.08)',
        'popover': '0 12px 28px -8px rgba(35,27,110,0.18), 0 2px 4px rgba(20,22,42,0.06)',
        'focus':   '0 0 0 3px rgba(122,106,245,0.25)',

        // Aliases for the legacy class names found in the codebase.
        // Delete these two blocks AFTER you've run the find/replace
        // documented in MIGRATION.md.
        'subtle':    '0 1px 3px rgba(20,22,42,0.06), 0 1px 2px rgba(20,22,42,0.04)',
        'map-panel': '0 4px 12px -2px rgba(20,22,42,0.08), 0 2px 4px rgba(20,22,42,0.04)',
        'float-sm':  '0 4px 12px -2px rgba(20,22,42,0.08), 0 2px 4px rgba(20,22,42,0.04)',
        'float-md':  '0 12px 28px -8px rgba(20,22,42,0.12), 0 4px 8px -4px rgba(20,22,42,0.06)',
        'float-lg':  '0 24px 48px -12px rgba(20,22,42,0.16), 0 8px 16px -8px rgba(20,22,42,0.08)',
      },

      // ── Motion (Propsight motion language) ───────────────
      transitionDuration: {
        '120': '120ms',
        '180': '180ms',
        '240': '240ms',
        '320': '320ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
        'enter':    'cubic-bezier(0, 0, 0.2, 1)',
        'exit':     'cubic-bezier(0.4, 0, 1, 1)',
        'emphasis': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      keyframes: {
        'pulse-ring': {
          '0%':   { transform: 'scale(0.6)', opacity: '0.6' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'fade-in':    'fade-in 180ms cubic-bezier(0, 0, 0.2, 1)',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('tailwind-scrollbar')],
};
