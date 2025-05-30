import { createSigner } from '@guildxyz/sdk';
import { useAccount, useSignMessage } from 'wagmi';

export const useWagmiSigner = () => {
  const { signMessageAsync } = useSignMessage();
  const { address } = useAccount();

  if (!address || !signMessageAsync) {
    throw new Error('No signer found');
  }

  const signerFunction = createSigner.custom(
    (message: string) => signMessageAsync({ message }),
    address
  );

  return signerFunction;
};
