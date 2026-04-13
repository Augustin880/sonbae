import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fff8f1',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#202124',
          muted: '#5f6368',
          subtle: '#8a8d91',
        },
        line: '#f0dfcf',
        brand: {
          DEFAULT: '#f58220',
          dark: '#c85812',
          soft: '#fff0df',
        },
        accent: {
          DEFAULT: '#e94b35',
          soft: '#ffe4dd',
        },
        signal: {
          DEFAULT: '#b06c00',
          soft: '#fff3cf',
        },
        info: {
          DEFAULT: '#3f6f8f',
          soft: '#e7f2f8',
        },
        success: {
          DEFAULT: '#28784d',
          soft: '#e3f5ea',
        },
        danger: {
          DEFAULT: '#b42318',
          soft: '#fde7e5',
        },
        paper: '#fff8f1',
        forest: '#f58220',
        coral: '#e94b35',
        gold: '#b06c00',
        sky: '#fff0df',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        eyebrow: ['0.75rem', { lineHeight: '1rem', fontWeight: '700' }],
        display: ['2.5rem', { lineHeight: '3rem', fontWeight: '750' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      borderRadius: {
        ui: '8px',
        smui: '6px',
      },
      boxShadow: {
        soft: '0 18px 45px rgb(197 88 18 / 0.12)',
        focus: '0 0 0 3px rgb(245 130 32 / 0.24)',
      },
    },
  },
  plugins: [],
} satisfies Config;
