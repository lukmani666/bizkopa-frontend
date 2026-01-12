// components/theme-sync.tsx
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.add(media.matches ? 'dark' : 'light');

      const handler = () => {
        root.classList.toggle('dark', media.matches);
        root.classList.toggle('light', !media.matches);
      };

      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }

    root.classList.add(theme);
  }, [theme]);

  return null;
}
