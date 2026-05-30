/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',
        'dark-card': '#18181b',
        'dark-border': '#27272a',
        'dark-muted': '#71717a',
        'neon': '#e8ff47',
        'cyan-accent': '#06b6d4',
        'orange-accent': '#f97316',
        'red-accent': '#ef4444',
        'green-accent': '#10b981',
      },
      boxShadow: {
        'fab': '0 10px 40px rgba(232, 255, 71, 0.4)',
        'fab-hover': '0 15px 50px rgba(232, 255, 71, 0.5)',
      },
    },
  },
  plugins: [],
}
