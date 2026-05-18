export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ebe7e6',
          dim: '#ddd9d8',
          bright: '#f8f5f4',
          50: '#ffffff',
          100: '#f7f3f2',
          200: '#f1edec',
          300: '#ebe7e6',
          400: '#e5e2e1',
          500: '#c4c7c7',
          600: '#747878',
          variant: '#e5e2e1',
        },
        charcoal: {
          50: '#f4f0ef',
          200: '#c8c6c5',
          400: '#858383',
          500: '#444748',
          600: '#313030',
          700: '#1c1b1b',
          800: '#0e0d0d',
          900: '#000000',
        },
        gold: {
          100: '#ffe088',
          200: '#fed65b',
          300: '#e9c349',
          500: '#735c00',
          700: '#574500',
        },
        slate: {
          DEFAULT: '#747878',
          100: '#e5e2e1',
          300: '#c4c7c7',
          500: '#747878',
          700: '#444748',
        },
        danger: { DEFAULT: '#ba1a1a', soft: '#ffdad6', deep: '#93000a' },
      },
      fontFamily: {
        // The fallback fonts have adjusted metrics (see index.css @font-face)
        // so they occupy the same space as the web fonts before they load.
        // This keeps CLS near zero when fonts swap in.
        display: ['"Noto Serif"', '"Noto Serif Fallback"', 'Georgia', 'serif'],
        sans: ['Inter', '"Inter Fallback"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['64px', { lineHeight: '1.1', letterSpacing: '0' }],
        h2: ['48px', { lineHeight: '1.2', letterSpacing: '0' }],
        h3: ['32px', { lineHeight: '1.3', letterSpacing: '0' }],
        h4: ['24px', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['18px', { lineHeight: '1.6', letterSpacing: '0' }],
        'body-md': ['16px', { lineHeight: '1.6', letterSpacing: '0' }],
        caption: ['12px', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      letterSpacing: {
        body: '0',
        caption: '0.1em',
      },
      spacing: {
        unit: '8px',
        small: '16px',
        gutter: '32px',
        edge: '64px',
        section: '128px',
      },
      maxWidth: {
        container: '1440px',
        prose: '70ch',
      },
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(26, 26, 26, 0.05)',
        none: 'none',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
