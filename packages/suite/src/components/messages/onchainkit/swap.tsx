import { useTheme } from '@/components/providers/ThemeProvider';
import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToast,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';

import { OnchainKitSwapMessageContent } from '@getgrowly/core';

const OnchainKitSwapMessage = ({
  fromToken,
  swappableTokens,
  toToken,
}: OnchainKitSwapMessageContent['content']) => {
  const { theme } = useTheme();
  return (
    <div style={{ backgroundColor: theme.background.default, color: theme.text.primary }}>
      <Swap className="w-full" headerLeftContent={''} title={''}>
        <div data-growly-workflow=""></div>
        <SwapAmountInput
          label="Sell"
          swappableTokens={swappableTokens}
          token={fromToken}
          type="from"
        />
        <SwapToggleButton />
        <SwapAmountInput label="Buy" swappableTokens={swappableTokens} token={toToken} type="to" />
        <SwapButton />
        <SwapMessage />
        <SwapToast />
      </Swap>
    </div>
  );
};

export const buildOnchainKitSwapMessage = (content: OnchainKitSwapMessageContent['content']) => {
  return <OnchainKitSwapMessage {...content} />;
};
