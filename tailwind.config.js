/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Overriding Tailwind's "white" so every existing text-white / bg-white(/opacity)
        // utility renders correctly on the new light surface instead of literal white.
        white: '#14161A',

        // Surfaces (repurposed token names kept for backward compatibility)
        void: '#F7F7F4',     // page background (paper)
        cosmos: '#FFFFFF',   // card surface
        nebula: '#EFEFEA',   // secondary surface / hairlines

        // Brand + category identity colors
        violet: { DEFAULT: '#0E6E7C', light: '#3F98A3', glow: 'rgba(14,110,124,0.18)' }, // primary brand (petrol teal)
        cyan: { DEFAULT: '#3B5BA5', glow: 'rgba(59,91,165,0.18)' },   // Technical identity
        pink: '#C1652E',                                              // Geo identity (burnt amber)
        plum: '#7C3F6B',                                              // AEO identity

        emerald: '#1F8A5F', // good
        solar: '#C97A2B',   // warn
        nova: '#C13B3B',    // bad

        ink: '#14161A',
        'ink-soft': '#5A5F6B',
        'ink-faint': '#8A8F98',
        paper: '#F7F7F4',
        border: '#E4E4DF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-fine': "linear-gradient(rgba(20,22,26,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,22,26,0.05) 1px, transparent 1px)",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 26s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-14px)' } },
        scan: { '0%': { top: '0%', opacity: '0' }, '10%': { opacity: '1' }, '90%': { opacity: '1' }, '100%': { top: '100%', opacity: '0' } },
        gradient: { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
    },
  },
  plugins: [],
};
