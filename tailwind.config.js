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
        primaryLighter: '#818CF8',
        primaryDarker: '#312E81',

        success: '#16A34A',
        successLight: '#22C55E',
        successDark: '#15803D',
        danger: '#DC2626',
        dangerLight: '#EF4444',
        dangerDark: '#B91C1C',
        warning: '#F59E0B',
        warningLight: '#FBBF24',
        warningDark: '#D97706',
        info: '#0EA5E9',
        infoLight: '#38BDF8',
        infoDark: '#0284C7',

        // Light mode
        background: '#FFFFFF',
        backgroundAlt: '#F3F4F6',
        backgroundAltDarker: '#E5E7EB',
        border: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
        textTertiary: '#9CA3AF',
        textDisabled: '#D1D5DB',

        // Dark mode
        backgroundDark: '#0F172A',
        backgroundAltDark: '#1E293B',
        backgroundAltDarkerDark: '#334155',
        borderDark: '#475569',
        textPrimaryDark: '#F8FAFC',
        textSecondaryDark: '#CBD5E1',
        textTertiaryDark: '#94A3B8',
        textDisabledDark: '#64748B',

        skeleton: '#E5E7EB',
        skeletonDark: '#334155',
      },
    },
  },
  plugins: [],
};
