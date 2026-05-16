import { ThemeContext } from '@/contexts/ThemeContext/ThemeContext';

import { use } from 'react';

export const useTheme = () => {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error('useTheme debe usarse dentro de <ThemeProvider>');
  }

  return context;
};
