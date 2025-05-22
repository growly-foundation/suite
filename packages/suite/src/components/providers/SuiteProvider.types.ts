import { OnchainKitProviderReact } from '@coinbase/onchainkit';
import { AgentId } from '@getgrowly/core';
import { ThemeConfig, ThemeName } from '@/types/theme';

/**
 * Configuration for the Growly Suite.
 */
export interface SuiteConfig {
  /**
   * Theme configuration
   */
  theme?: ThemeConfig;

  /**
   * Theme mode: 'light', 'dark', or 'system' (follows user preference)
   */
  themeMode?: ThemeName;

  /**
   * Brand name to display in the app
   */
  brandName?: string;

  /**
   * Display mode for the widget.
   */
  display?: 'fullView' | 'panel';
}

export interface SuiteGlobalContext {
  /**
   * Agent ID which the widget will be associated with.
   */
  agentId: AgentId;
  // TODO: Right now, use the organization ID as the API Key.
  organizationApiKey: string;
  /**
   * Session configuration.
   */
  session?: Partial<{
    /**
     * Wallet address.
     */
    walletAddress: `0x${string}`;
    /**
     * Connect wallet function.
     */
    connect?: () => void;
    /**
     * WalletConnect project ID.
     *
     * Suite will use the provided project ID to connect to WalletConnect.
     * @see https://rainbowkit.com/docs/installation#configure
     */
    walletConnect?: {
      projectId: string;
    };
  }>;
  config?: SuiteConfig;
  integration?: {
    /**
     * Configuration for the OnchainKit feature.
     */
    onchainKit?: Omit<OnchainKitProviderReact, 'children' | 'address'> & { enabled: boolean };
  };
}
