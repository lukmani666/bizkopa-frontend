// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: 'class', // class-based dark mode
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//     './app/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       colors: {
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',

//         primary: {
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },
//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },

//         emerald: {
//           50: 'hsl(var(--emerald-50))',
//           100: 'hsl(var(--emerald-100))',
//           200: 'hsl(var(--emerald-200))',
//           300: 'hsl(var(--emerald-300))',
//           400: 'hsl(var(--emerald-400))',
//           500: 'hsl(var(--emerald-500))',
//           600: 'hsl(var(--emerald-600))',
//           700: 'hsl(var(--emerald-700))',
//           800: 'hsl(var(--emerald-800))',
//           900: 'hsl(var(--emerald-900))',
//           950: 'hsl(var(--emerald-950))',
//         },
//       },

//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },

//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//       },

//       keyframes: {
//         'fade-in': { '0%': { opacity: 0, transform: 'translateY(10px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
//         'fade-in-up': { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
//         'scale-in': { '0%': { opacity: 0, transform: 'scale(0.95)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
//       },

//       animation: {
//         'fade-in': 'fade-in 0.5s ease-out forwards',
//         'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
//         'scale-in': 'scale-in 0.3s ease-out forwards',
//       },
//     },
//   },
//   plugins: [require('tailwindcss-animate')],
// };

import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
} satisfies Config;

