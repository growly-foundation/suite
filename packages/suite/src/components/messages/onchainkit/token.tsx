import { OnchainKitTokenMessageContent } from '@getgrowly/core';
import { TokenChip } from '@coinbase/onchainkit/token';
import { useTheme } from '@/components/providers/ThemeProvider';

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
