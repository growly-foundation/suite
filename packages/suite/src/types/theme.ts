import { DeepPartial } from '@/types/utility';

/**
 * Theme tokens organized by semantic categories
 */
export interface ThemeTokens {
  // Brand colors
  brand: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // Background colors
  background: {
    default: string;
    paper: string; // Component backgrounds
    subtle: string; // Subtle backgrounds for hover states
    inverse: string; // Inverse background
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string; // For text on dark backgrounds
  };

  // UI element colors
  ui: {
    header: {
      background: string;
      text: string;
    };
    border: {
      default: string;
      strong: string;
    };
    focus: string;
    divider: string;
  };

  // Feedback colors
  feedback: {
    error: string;
    warning: string;
    success: string;
    info: string;
  };

  // Typography
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };

  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Border radius
  radius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };

  // Shadows
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}

/**
 * Predefined theme names
 */
export enum ThemeName {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

/**
 * Theme configuration type that can be passed to the SuiteProvider
 */
export type ThemeConfig = DeepPartial<ThemeTokens>;
