import { themes } from '@/theme/themes';
import { createContext, useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'react-native';
import { ThemeContextProps, ThemeContextType } from './ThemeContext.types';

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType,
);

export function ThemeProvider(props: ThemeContextProps) {
  const { theme: initialTheme, children } = props;

  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  const onChangeTheme = useCallback((theme: ThemeContextProps['theme']) => {
    setCurrentTheme(theme);
  }, []);

  const value = useMemo(
    () => ({ theme: themes[initialTheme], currentTheme, onChangeTheme }),
    [initialTheme, currentTheme, onChangeTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StatusBar
        barStyle={initialTheme === 'dark' ? 'light-content' : 'dark-content'}
      />

      {children}
    </ThemeContext.Provider>
  );
}
