import { ThemeTokens } from '@/types/theme';

/**
 * Light theme - default theme for the application
 */
export const lightTheme: ThemeTokens = {
  brand: {
    primary: '#0052ff',
    secondary: '#3c79fd',
    accent: '#0066ff',
  },
  background: {
    default: '#ffffff',
    paper: '#f9fafb',
    subtle: '#f3f4f6',
    inverse: '#111827',
  },
  text: {
    primary: '#111827',
    secondary: '#4b5563',
    muted: '#6b7280',
    inverse: '#ffffff',
  },
  ui: {
    header: {
      background: '#ffffff',
      text: '#111827',
    },
    border: {
      default: '#e5e7eb',
      strong: '#d1d5db',
    },
    focus: '#0052ff',
    divider: '#e5e7eb',
  },
  feedback: {
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
  },
  typography: {
    fontFamily: 'var(--gas-font-family, system-ui, sans-serif)',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
};

/**
 * Dark theme - used when dark mode is enabled
 */
export const darkTheme: ThemeTokens = {
  brand: {
    primary: '#0052ff',
    secondary: '#3c79fd',
    accent: '#0050ff',
  },
  background: {
    default: '#111827',
    paper: '#1f2937',
    subtle: '#374151',
    inverse: '#111827',
  },
  text: {
    primary: '#f9fafb',
    secondary: '#e5e7eb',
    muted: '#9ca3af',
    inverse: '#ffffff',
  },
  ui: {
    header: {
      background: '#1f2937',
      text: '#f9fafb',
    },
    border: {
      default: '#374151',
      strong: '#4b5563',
    },
    focus: '#3c79fd',
    divider: '#374151',
  },
  feedback: {
    error: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    info: '#60a5fa',
  },
  typography: {
    fontFamily: 'var(--gas-font-family, system-ui, sans-serif)',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
  },
};
