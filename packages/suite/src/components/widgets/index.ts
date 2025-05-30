import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

import { GrowlyButton } from './components/GrowlyButton';
import { GrowlyDiv } from './components/GrowlyDiv';
import { GrowlyStep } from './components/GrowlyStep';

export const GrowlyComponent = {
  Step: GrowlyStep,
  Button: GrowlyButton,
  Div: GrowlyDiv,
};

export * from './components/ChatWidget';
export * from './components/DemoChatWidget';
export * from './components/StaticWidget';
