import { BookOpen, ExternalLink, Plus } from 'lucide-react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Card } from '../ui/card';

export default function KnowYourDapp() {
  return (
    <div className="flex justify-center">
      <Card className="overflow-hidden border-gray-200 w-[320px] shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
        <CardHeader className="pb-0 bg-white">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Manager your resources
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-6 h-6 mr-3 relative">
              <img
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                src="/icons/dapps/uniswap.png"
                alt="Uniswap"
              />
            </div>
            <span className="text-sm font-medium text-gray-700">app.uniswap.org/swap</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-600 mr-3">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">github.com/Uniswap/interface</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <BookOpen className="h-5 w-5 mr-3 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">support.uniswap.org</span>
          </div>

          <div
            className={cn(
              'flex items-center p-3 border border-dashed border-gray-300 rounded-lg',
              'bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer'
            )}>
            <Plus className="h-5 w-5 text-gray-500 mr-3" />
            <span className="text-sm text-gray-500 font-medium">Add more resources</span>
          </div>
        </CardContent>
        <CardFooter className="pt-0 bg-white">
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-600 hover:text-gray-800 hover:bg-gray-50/50">
            Learn more
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
