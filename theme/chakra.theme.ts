import { createSystem, defaultConfig } from '@chakra-ui/react';

export const chakraTheme = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#ecfdf5" },
          100: { value: "#d1fae5" },
          500: { value: "#10B981"},
          600: { value: "#059669"},
        }
      }
    }
  }
});