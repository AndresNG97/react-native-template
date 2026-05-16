# Arquitectura y patrones de diseño

Documento de referencia con las convenciones, patrones y estructura de archivos que sigue el proyect

---

## 1. Stack tecnológico

| Capa                 | Librería                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Framework            | React Native `0.85.2` + React `19.2.3`                                                                                                |
| Lenguaje             | TypeScript `^5.8.3`                                                                                                                   |
| Navegación           | `@react-navigation/native` v7 (`native-stack` + `bottom-tabs`)                                                                        |
| Estado global        | React Context API + hook `use()` (React 19)                                                                                           |
| Persistencia local   | `react-native-mmkv`                                                                                                                   |
| Internacionalización | `i18next` + `react-i18next` (compilado con Gulp)                                                                                      |
| Formularios          | `react-hook-form`                                                                                                                     |
| UI / Animación       | `react-native-reanimated`, `react-native-gesture-handler`, `@gorhom/bottom-sheet`, `react-native-linear-gradient`, `react-native-svg` |
| Notificaciones       | `@notifee/react-native`                                                                                                               |
| Lint / Format        | ESLint (`@react-native`) + Prettier (`@ianvs/prettier-plugin-sort-imports`)                                                           |
| Utilidades           | `lodash`                                                                                                                              |

Node `>= 22.11.0`. El bundler es Metro (config por defecto de RN).

---

## 1.1 Gestión de dependencias

Antes de instalar cualquier librería de terceros:

- Verifica que tenga mantenimiento activo (último commit reciente, issues atendidos)
- Comprueba su puntuación en [Socket.dev](https://socket.dev) — no instales nada con vulnerabilidades conocidas sin resolución
- Revisa su score en [npmjs.com](https://npmjs.com): descargas semanales, dependencias, y estado general
- Descarta librerías deprecadas, abandonadas o sin mantenedor activo

Si no cumple estos criterios, propón una alternativa que sí los cumpla o implementa la solución sin dependencia externa.

## 2. Configuración base

### 2.1 Alias de imports `@/`

El alias `@` apunta a la carpeta `src` y está declarado en **dos sitios** (deben mantenerse en sync):

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

`babel.config.js`:

```js
plugins: [
  ['module-resolver', { root: ['./src'], alias: { '@': './src' } }],
  'react-native-worklets/plugin',
],
```

## 3. Estructura general de `src/`

```
src/
├── App.tsx                     # Composición de providers + StatusBar
├── assets/                     # Recursos estáticos
│   ├── fonts/                  # Inter-{Regular,Medium,SemiBold,Bold}.ttf
│   ├── icons/                  # Iconos SVG como componentes React
│   └── logos/                  # Logos PNG de cada servicio
├── components/                 # Componentes UI reutilizables
├── contexts/                   # Providers de Context API
├── database/                   # Datos seed (JSON)
├── hooks/                      # Hooks transversales
├── i18n/                       # Bootstrap de i18next
├── lib/                        # Adaptadores a librerías externas
├── models/                     # Tipos del dominio
├── navigations/                # Navegadores y sus tipos
├── screens/                    # Pantallas de la app
├── storage/                    # Acceso a MMKV por dominio
├── theme/                      # Tokens de diseño (light/dark)
├── translations/               # Traducciones globales y compiladas
├── types/                      # Tipos genéricos compartidos
└── utils/                      # Funciones puras
```

## 3.1 Estructura de los componentes

```
Typography/
├── Typography.tsx                     # Implementación del componente
├── Typography.types.ts                # Tipos públicos (TypographyProps, TypographyRef…)
├── Typography.styles.ts               # Función de estilos parametrizada por el tema
├── Typography.translations.json       # (opcional) Traducciones co-localizadas
├── Typography.utils.tsx               # (opcional) Helpers específicos del componente
├── Typography.form.ts                 # (opcional) Schema de react-hook-form
└── index.ts                    # Barrel: re-exporta el símbolo público
```

Nunca se hace destructuring directo en los parámetros de la función.

---

### 3.1 Props y Destructuring en Componentes

```tsx
export function Typography(props: TypographyProps) {
  const {} = props; // ← primera línea siempre
}
```

## 3.2 Barrel exports (`index.ts`)

Cada carpeta termina con un `index.ts` muy simple que re-exporta el símbolo público:

```ts
// src/components/Cell/index.ts
export { Cell } from './Cell';
```

Esto permite imports limpios desde el resto del código:

```ts
import { Cell, Switch, Typography } from '@/components';
```

**`useStyles(styles)` siempre que haya estilos temáticos**. La variable se llama `styled` (no `styles`, para no chocar con el import).
**`useTheme()`** cuando se necesita un color directo (iconos, gradientes, animaciones).

## 3.3 Si se remplaza un componente primitivo se añadira un alias con las iniciales de la libreria RN = React Native

```tsx
import { Button as RNButton } from 'react-native';
import { ButtonProps } from './Button.types';

export function Button(props: ButtonProps) {
  const { children, ...rest } = props;

  return <RNButton {...rest}>{children}</RNButton>;
}
```

### 4 Estilos (`Typography.styles.ts`)

Patrón único en todo el proyecto: **`styles` es una función `(theme) => StyleSheet.create({...})`** que se invoca a través de `useStyles`.

```ts
// src/components/Typography/Typography.styles.ts
import { StyleSheet } from 'react-native';
import { ThemeType } from '@/theme/types';

export function styles(theme: ThemeType) {
  return StyleSheet.create({});
}
```

### 4.1 Tema (theme tokens)

Vive en `src/theme/`:

```
theme/
├── themes.ts           # Mapa { dark, light } con las dos variantes
├── types.ts            # Definición de ThemeType
└── variants/
    ├── dark.ts
    └── light.ts
```

### 5 Estructura de un contexto

```
contexts/GlobalContext/
├── GlobalContext.tsx           # createContext + Provider
├── GlobalContext.types.ts      # GlobalContextType + Props del Provider
└── index.ts                    # Re-exporta el Provider
```

```tsx
// GlobalContext.tsx
export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType,
);

export function GlobalProvider(props: GlobalContextProps) {
  const { children } = props;

  const value = useMemo(
    () => ({ ... }),
    [...],
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
```

Por cada contexto hay un hook `useGlobal` en `src/hooks/`:

```ts
// src/hooks/useGlobal.ts
import { use } from 'react';
import { GlobalContext } from '@/contexts/GlobalContext/GlobalContext';

export const useGlobal = () => {
  const context = use(GlobalContext);

  if (!context) {
    throw new Error('useGlobal debe usarse dentro de <GlobalProvider>');
  }

  return context;
};
```

## 5. Modelos del dominio

`src/models/<Entidad>/<Entidad>.ts(x)` define los tipos del dominio. Solo `type`s, ninguna lógica.

```ts
// src/models/UserModel/UserModel.tsx
export type UserModel = {
  id: string;
  name: string;
};
```

## 6. Navegación

Estructura en `src/navigations/`:

```
navigations/
├── RootNavigator/              # Stack raíz
```

Cada navegador sigue el mismo patrón de carpeta:

```
RootNavigator/
├── RootNavigator.tsx
├── RootNavigator.types.ts
├── RootNavigator.styles.ts
├── RootNavigator.translations.json (si aplica)
└── index.ts
```

### 6.1 Tipos de navegación

Por cada navegador se exportan **cuatro alias** con la misma plantilla:

```ts
// AppNavigator.types.ts
export type AppNavigatorParamsList = {
  Home: undefined;
  Config: undefined;
  Settings: undefined;
};

export type AppKey = keyof AppNavigatorParamsList;

export type AppNavigationProp<T extends AppKey> = BottomTabNavigationProp<
  AppNavigatorParamsList,
  T
>;

export type AppScreenProps<T extends AppKey> = BottomTabScreenProps<
  AppNavigatorParamsList,
  T
>;
```

Para navegadores anidados se usa `CompositeScreenProps` / `CompositeNavigationProp`:

```ts
export type AppNavigationProp<T extends ConfigKey> = CompositeNavigationProp<
  NativeStackNavigationProp<AppNavigatorParamsList, T>,
  RootNavigationProp<RootKey>
>;

export type AppScreenProps<T extends ConfigKey> = CompositeScreenProps<
  NativeStackScreenProps<AppNavigatorParamsList, T>,
  RootScreenProps<RootKey>
>;
```

Las pantallas tipan `props` con esos alias:

```tsx
export function SettingsScreen(props: AppScreenProps<'Config'>) {
  const { navigation } = props;
  // …
}
```
