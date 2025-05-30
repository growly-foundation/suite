import { Search } from 'lucide-react';
import Image from 'next/image';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Progress } from '../ui/progress';

export default function Persona() {
  return (
    <div className="flex justify-center">
      <Card className="overflow-hidden border-gray-200 w-[320px] shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardContent className="p-6 space-y-4 bg-white">
          <div className="flex flex-col items-center mb-2">
            <div className="w-16 h-16 rounded-lg overflow-hidden mb-2 shadow-sm">
              <Image
                src="/logos/suite-user.png"
                alt="User Avatar"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800">cptin.base.eth</h3>
            <p className="text-xs text-gray-500">0x004...f3929</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">DeFi Know-how</span>
                <span className="text-sm text-gray-500">5%</span>
              </div>
              <Progress value={5} className="h-2 bg-gray-100" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Risk Level</span>
                <span className="text-sm text-gray-500">40%</span>
              </div>
              <Progress value={40} className="h-2 bg-gray-100" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Portfolio Balance</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-blue-400 h-full" style={{ width: '50%' }}></div>
                  <div className="bg-indigo-500 h-full" style={{ width: '5%' }}></div>
                  <div className="bg-blue-600 h-full" style={{ width: '20%' }}></div>
                  <div className="bg-black h-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <div
                  className={cn(
                    'flex items-center bg-gray-50 rounded-full px-2 py-1',
                    'hover:bg-gray-100 transition-colors'
                  )}>
                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-1.5"></div>
                  <span className="text-xs font-medium text-gray-700">USDT</span>
                </div>
                <div
                  className={cn(
                    'flex items-center bg-gray-50 rounded-full px-2 py-1',
                    'hover:bg-gray-100 transition-colors'
                  )}>
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5"></div>
                  <span className="text-xs font-medium text-gray-700">ETH</span>
                </div>
                <div
                  className={cn(
                    'flex items-center bg-gray-50 rounded-full px-2 py-1',
                    'hover:bg-gray-100 transition-colors'
                  )}>
                  <div className="w-2 h-2 rounded-full bg-blue-600 mr-1.5"></div>
                  <span className="text-xs font-medium text-gray-700">BNKR</span>
                </div>
                <div
                  className={cn(
                    'flex items-center bg-gray-50 rounded-full px-2 py-1',
                    'hover:bg-gray-100 transition-colors'
                  )}>
                  <div className="w-2 h-2 rounded-full bg-black mr-1.5"></div>
                  <span className="text-xs font-medium text-gray-700">ZORA</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 bg-white">
          <Button className="w-full justify-center bg-primary hover:bg-primary/90 text-white text-sm">
            More insights
            <Search className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
