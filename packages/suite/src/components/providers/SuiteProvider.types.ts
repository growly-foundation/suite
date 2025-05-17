import { OnchainKitProviderReact } from '@coinbase/onchainkit';
import { AgentId } from '@getgrowly/core';

/**
 * Configuration for the Growly Suite.
 */
export interface SuiteConfig {
  /**
   * Widget theme configuration.
   */
  theme?: Partial<{
    primary: string;
    secondary: string;
    background: string;
    backgroundForeground: string;
    headerBackground: string;
    headerText: string;
    text: string;
    textForeground: string;
  }>;
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
