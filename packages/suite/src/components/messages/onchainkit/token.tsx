import { useTheme } from '@/components/providers/ThemeProvider';
import { TokenChip } from '@coinbase/onchainkit/token';

import { OnchainKitTokenMessageContent } from '@getgrowly/core';

export const OnchainKitTokenChipMessage = ({ token }: OnchainKitTokenMessageContent['content']) => {
  const { theme } = useTheme();
  return (
    <div style={{ backgroundColor: theme.background.default }}>
      <TokenChip className="shadow-none" isPressable={false} token={token} />
    </div>
  );
};

export const buildOnchainKitTokenChipMessage = (
  content: OnchainKitTokenMessageContent['content']
) => {
  return <OnchainKitTokenChipMessage {...content} />;
};
