import { useTheme } from '@/components/providers/ThemeProvider';
import { useMemo } from 'react';

/**
 * Returns style objects for components based on the current theme
 * This centralizes all theme-dependent styling logic
 */
export function useThemeStyles() {
  const { theme } = useTheme();

  return useMemo(() => {
    return {
      // Panel container styles
      panel: {
        container: {
          backgroundColor: theme.background.default,
          borderColor: theme.ui.border.default,
          boxShadow: theme.shadow.lg,
        },
        header: {
          backgroundColor: theme.ui.header.background,
          color: theme.ui.header.text,
          borderColor: theme.ui.border.default,
        },
      },

      // Text styles
      text: {
        primary: { color: theme.text.primary },
        secondary: { color: theme.text.secondary },
        muted: { color: theme.text.muted },
        inverse: { color: theme.text.inverse },
      },

      // Button styles
      button: {
        primary: {
          backgroundColor: theme.brand.primary,
          color: theme.text.primary,
          hoverColor: theme.brand.secondary,
        },
        secondary: {
          backgroundColor: theme.background.subtle,
          color: theme.text.primary,
          hoverColor: theme.background.paper,
        },
        accent: {
          backgroundColor: theme.brand.accent,
          color: theme.text.inverse,
          hoverColor: theme.brand.accent, // Would need a lighter/darker version
        },
      },

      // Banner styles
      banner: {
        backgroundColor: theme.brand.primary,
        color: theme.text.inverse,
      },

      // Card styles
      card: {
        backgroundColor: theme.background.paper,
        borderColor: theme.ui.border.default,
        boxShadow: theme.shadow.sm,
      },

      // Chat styles
      chat: {
        userMessage: {
          backgroundColor: theme.brand.primary,
          color: theme.text.inverse,
        },
        agentMessage: {
          backgroundColor: theme.background.paper,
          color: theme.text.primary,
        },
        input: {
          backgroundColor: theme.background.default,
          borderColor: theme.ui.border.default,
          color: theme.text.primary,
          placeholderColor: theme.text.muted,
        },
      },

      // Action button styles
      quickAction: {
        container: {
          backgroundColor: theme.background.paper,
          hoverBackgroundColor: theme.background.subtle,
          borderColor: theme.ui.border.default,
        },
        icon: {
          primary: theme.brand.primary,
          accent: theme.brand.accent,
          info: theme.feedback.info,
          success: theme.feedback.success,
          warning: theme.feedback.warning,
          error: theme.feedback.error,
        },
        text: {
          primary: theme.text.primary,
          secondary: theme.text.secondary,
        },
      },
    };
  }, [theme]);
}
