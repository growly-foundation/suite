import { Atoms } from '../../lib/ui';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button, Loadable, Modal } from '../../lib/ui/atoms';
import WalletAddress from '../../lib/ui/molecules/WalletAddress/WalletAddress';
import { useMemo } from 'react';
import { TAddress } from 'chainsmith/src/types';
import { Badge, Card } from '@radix-ui/themes';
import { useState } from 'react';
import { Wallet, WalletIcon } from 'lucide-react';
import { selectState, setState, useMagicContext } from '@/core';

export const ConnectWalletWithPrivyButton = () => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { ready, authenticated, logout, login } = usePrivy();
  const { ready: readyWallets } = useWallets();
  const { userWallet, agentWallet } = useMagicContext();
  const loginDisabled = useMemo(() => !ready || (ready && authenticated), [authenticated, ready]);

  return (
    <div>
      <Loadable
        isLoading={!readyWallets || (!selectState(userWallet) && !selectState(agentWallet))}
        loadComponent={
          <Atoms.Button loading={!ready || !readyWallets} disabled={loginDisabled} onClick={login}>
            Connect your wallet <Wallet size={18} />
          </Atoms.Button>
        }>
        {!!selectState(userWallet) && !!selectState(agentWallet) && (
          <div>
            <Modal open={popoverOpen} handleOpen={open => setPopoverOpen(open)}>
              <div>
                <Card className="bg-white rounded-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <WalletAddress
                      className="my-1"
                      address={selectState(userWallet)?.address as TAddress}
                      truncated
                      truncatedLength={15}
                    />
                    <Badge className="px-3 py-2 rounded-2xl" color="green">
                      Your wallet <WalletIcon size={15} className="ml-3" />
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <WalletAddress
                      className="my-1"
                      address={selectState(agentWallet)?.address as TAddress}
                      truncated
                      truncatedLength={15}
                    />
                    <Badge className="px-3 py-2 rounded-2xl" color="blue">
                      Agent wallet 🤖
                    </Badge>
                  </div>
                  <Button
                    className="w-full rounded-xl"
                    color="red"
                    onClick={() => {
                      logout();
                      setState(userWallet)(undefined);
                      setState(agentWallet)(undefined);
                    }}>
                    👋 Disconnect wallet
                  </Button>
                </Card>
              </div>
            </Modal>
            <WalletAddress
              onClick={() => setPopoverOpen(true)}
              truncated
              className="py-7 relative"
              truncatedLength={15}
              address={selectState(userWallet)?.address as any}
            />
          </div>
        )}
      </Loadable>
    </div>
  );
};
