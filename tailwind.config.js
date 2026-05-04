/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#2563eb',
        surface: '#f7f6f3',
        'surface-2': '#eeede9',
        muted: '#6b6860',
        subtle: '#aeaca6',
        border: '#e8e6e1',
      },
      fontFamily: {
        sans: ['"DM Sans"', '"Noto Sans JP"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
