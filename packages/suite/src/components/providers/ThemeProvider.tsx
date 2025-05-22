import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeConfig, ThemeName, ThemeTokens } from '@/types/theme';
import { darkTheme, lightTheme } from '@/styles/themes';
import { deepMerge } from '../../utils/object';

interface ThemeContextType {
  theme: ThemeTokens;
  themeName: ThemeName;
  setThemeName: (theme: ThemeName) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  themeOverrides?: ThemeConfig;
}

/**
 * Provides theme context for the application
 */
export function ThemeProvider({
  children,
  defaultTheme = ThemeName.Light,
  themeOverrides = {},
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ThemeName.Light | ThemeName.Dark>(ThemeName.Light);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? ThemeName.Dark : ThemeName.Light);
    };

    // Set initial value
    setSystemTheme(mediaQuery.matches ? ThemeName.Dark : ThemeName.Light);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Determine the active theme based on themeName (which could be 'system')
  const activeThemeName = useMemo(() => {
    return themeName === ThemeName.System ? systemTheme : themeName;
  }, [themeName, systemTheme]);

  // Memoize the actual theme object with any overrides applied
  const theme = useMemo(() => {
    const baseTheme = activeThemeName === ThemeName.Dark ? darkTheme : lightTheme;
    // Type assertion to ensure proper compatibility between theme objects
    return deepMerge(baseTheme, themeOverrides as any) as ThemeTokens;
  }, [activeThemeName, themeOverrides]);

  // Inject CSS variables for the theme
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.setAttribute('id', 'cream-theme-variables');

    // Flatten theme object into CSS variables
    const cssVars = getCssVariablesFromTheme(theme);
    style.textContent = `:root { ${cssVars} }`;

    // Remove any existing theme styles
    document.getElementById('cream-theme-variables')?.remove();
    document.head.appendChild(style);
  }, [theme]);

  // Context value
  const value = useMemo(
    () => ({
      theme,
      themeName,
      setThemeName,
      isDark: activeThemeName === ThemeName.Dark,
    }),
    [theme, themeName, activeThemeName]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook to access theme context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Helper function to convert a theme object into CSS variables
 */
function getCssVariablesFromTheme(theme: ThemeTokens): string {
  const flattenObject = (obj: any, prefix = '--theme-'): Record<string, string> => {
    return Object.keys(obj).reduce((acc: Record<string, string>, key: string) => {
      const value = obj[key];
      const newKey = `${prefix}${key}`;

      if (typeof value === 'object' && value !== null) {
        const nested = flattenObject(value, `${newKey}-`);
        return { ...acc, ...nested };
      } else {
        return { ...acc, [newKey]: value };
      }
    }, {});
  };

  const flattenedTheme = flattenObject(theme);
  return Object.entries(flattenedTheme)
    .map(([key, value]) => `${key}: ${value};`)
    .join(' ');
}
