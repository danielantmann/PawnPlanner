/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',

  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './presentation/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        primaryLight: '#6366F1',
        primaryDark: '#4338CA',

        success: '#16A34A',
        danger: '#DC2626',
        warning: '#F59E0B',

        // Light mode
        background: '#FFFFFF',
        backgroundAlt: '#F3F4F6',
        textPrimary: '#111827',
        textSecondary: '#6B7280',

        // Dark mode
        backgroundDark: '#0F0F14',
        backgroundDarkAlt: '#1A1A22',
        textPrimaryDark: '#F3F4F6',
        textSecondaryDark: '#9CA3AF',
      },
    },
  },

  plugins: [],
};
