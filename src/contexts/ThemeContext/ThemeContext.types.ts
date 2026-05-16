import { PropsWithChildren } from 'react';
import { ThemeType } from '@/theme/types';

type ThemeVariableType = 'light' | 'dark';

export type ThemeContextType = {
  theme: ThemeType;
  currentTheme: ThemeVariableType;
};

export type ThemeContextProps = PropsWithChildren<{
  theme: ThemeVariableType;
}>;
