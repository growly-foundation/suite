import Image from 'next/image';

import { cn } from '../../lib/utils';
import { Card, CardContent } from '../ui/card';

export default function IntentSuggestion() {
  return (
    <div className="flex justify-center">
      <Card className="overflow-hidden border-gray-200 w-[320px] shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardContent className="p-6 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex-grow overflow-auto space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src="https://github.com/growly-foundation/assets/blob/main/logo/growly.png?raw=true"
                    alt="Growly Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={cn(
                    'bg-gray-50 rounded-2xl rounded-tl-none p-3 text-xs text-gray-700',
                    'shadow-sm'
                  )}>
                  <p className="mb-2 text-gray-700">
                    Since you're <strong>new to DeFi</strong> and have{' '}
                    <strong>moderate risk expertise</strong>, you can swap{' '}
                    <strong>5% of USDT to ETH</strong> to gain more exposure to Ethereum (ETH).
                  </p>
                  <p className="mb-2 text-gray-700">
                    Ethereum (ETH) is the native cryptocurrency of the Ethereum network. You can{' '}
                    <a
                      href="https://ethereum.org/en/whitepaper/"
                      target="_blank"
                      className="text-gray-600 hover:text-gray-800 underline">
                      learn more in the Ethereum Whitepaper
                    </a>
                    .
                  </p>
                  <p className="mb-3 text-gray-500 text-[11px] italic">
                    Note: Always <em>do your own research</em> before executing any trade.
                  </p>
                  <div className="space-y-2">
                    <a
                      href="https://app.uniswap.org/swap?inputCurrency=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&outputCurrency=NATIVE&value=100&chain=base"
                      target="_blank">
                      <button
                        className={cn(
                          'w-full text-left flex items-center space-x-2 bg-white p-2 rounded-md',
                          'hover:bg-gray-100 transition-colors border border-gray-200'
                        )}>
                        <span className="text-gray-600">🔄</span>
                        <span className="text-xs text-gray-700">
                          Swap 100 USDC to ETH directly here
                        </span>
                      </button>
                    </a>

                    <a
                      href="https://app.uniswap.org/explore/pools/base/0xd0b53D9277642d899DF5C87A3966A349A798F224"
                      target="_blank">
                      <button
                        className={cn(
                          'w-full text-left flex items-center space-x-2 bg-white p-2 rounded-md',
                          'hover:bg-gray-100 transition-colors border border-gray-200'
                        )}>
                        <span className="text-gray-600">🔄</span>
                        <span className="text-xs text-gray-700">
                          Yield opportunities you might like: ETH/USDC
                        </span>
                      </button>
                    </a>
                  </div>
                </div>
              </div>

              {/* User Reply */}
              <div className="flex items-start space-x-3 justify-end">
                <div
                  className={cn(
                    'bg-gray-100 rounded-2xl rounded-tr-none p-3 text-xs text-gray-700 max-w-[80%]',
                    'shadow-sm'
                  )}>
                  <p>Thanks for the suggestions! I'll look into ETH.</p>
                </div>
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                  <Image
                    src="/logos/suite-user.png"
                    alt="User"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
