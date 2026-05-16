import { ThemeType } from '@/theme/types';
import { useTheme } from './useTheme';

type StylesFn<T, P> = (theme: ThemeType, props: P) => T;

export function useStyles<T, P>(styles: StylesFn<T, P>, props?: P): T {
  const { theme } = useTheme();

  return styles(theme, props ?? ({} as P));
}
