import {
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToast,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';
import { OnchainKitSwapMessageContent } from '@getgrowly/core';

export const buildOnchainKitSwapMessage = ({
  fromToken,
  swappableTokens,
  toToken,
}: OnchainKitSwapMessageContent['content']) => {
  return (
    <div>
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
