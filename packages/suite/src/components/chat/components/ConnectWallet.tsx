import { useTheme } from '@/components/providers/ThemeProvider';
import { Button } from '@/components/ui/button';
import { useSuite } from '@/hooks/use-suite';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletIcon } from 'lucide-react';

export const ConnectWallet = () => {
  const { session } = useSuite();
  const { theme } = useTheme();

  let connectButton = undefined;

  if (session?.connect) {
    connectButton = (
      <Button onClick={session?.connect}>
        <WalletIcon /> Connect Wallet
      </Button>
    );
  } else if (session?.walletConnect?.projectId) {
    connectButton = <ConnectButton />;
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="text-center" style={{ marginBottom: 10, color: theme.text.muted }}>
          No wallet found. <br />
          Please connect your wallet to continue.
        </div>
        {connectButton ? (
          connectButton
        ) : (
          <div className="text-center" style={{ color: theme.text.muted }}>
            No wallet connect method found.
          </div>
        )}
      </div>
    </div>
  );
};
