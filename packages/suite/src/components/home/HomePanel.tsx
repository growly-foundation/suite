import { useChatActions } from '@/hooks/use-chat-actions';
import { useSuiteSession } from '@/hooks/use-session';
import { useSuite } from '@/hooks/use-suite';
import { Screen } from '@/types/screen';
import { Bell, FileQuestion, LifeBuoy, MessageCircle } from 'lucide-react';

import { PanelBanner } from '../panel/components/PanelBanner';
import { QuickActionButton } from '../panel/components/PanelQuickActionButton';
import { ArrowLeftRight, Bell, FileQuestion, LifeBuoy, MessageCircle } from 'lucide-react';
import { useChatActions } from '@/hooks/use-chat-actions';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function HomePanel() {
  const { sendUserMessage } = useChatActions();
  const { setScreen } = useSuiteSession();
  const { config } = useSuite();
  const brandName = config?.brandName || 'Growly';
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Welcome Banner */}
      <PanelBanner title={`Welcome to ${brandName}! 👋`} description="How can we help you today?" />

      {/* Quick Actions */}
      <div className="p-4">
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <br />
        <h4 className="text-sm font-medium text-gray-500 mb-3">COMMON QUESTIONS</h4>
        <div className="space-y-2">
          <QuickActionButton
            icon={<Bell size={22} />}
            title={`Recent news about ${brandName}`}
            color="bg-blue-50"
            iconColor="text-blue-500"
            onClick={async () => {
              setScreen(Screen.Chat);
              await sendUserMessage(`Update me recent news about ${brandName}`);
            }}
          />
          <QuickActionButton
            icon={<FileQuestion size={22} />}
            title={`General information about ${brandName}`}
            color="bg-purple-50"
            iconColor="text-purple-500"
            onClick={async () => {
              setScreen(Screen.Chat);
              await sendUserMessage(`Update me a general information about ${brandName}`);
            }}
          />
          <QuickActionButton
            icon={<LifeBuoy size={22} />}
            title={'Analyze my current portfolio'}
            color="bg-amber-50"
            iconColor="text-amber-500"
            onClick={async () => {
              setScreen(Screen.Chat);
              await sendUserMessage('Can you help me to analyze my current portfolio status?');
            }}
          />
          <QuickActionButton
            icon={<ArrowLeftRight size={22} />}
            title={'Rebalance my portfolio'}
            color="bg-pink-50"
            iconColor="text-pink-500"
            onClick={async () => {
              setScreen(Screen.Chat);
              await sendUserMessage('Can you help me to suggest a rebalance for my portfolio?');
            }}
          />
          <QuickActionButton
            icon={<MessageCircle size={22} />}
            title="Start a conversation"
            color="bg-emerald-50"
            iconColor="text-emerald-500"
            onClick={() => setScreen(Screen.Chat)}
          />
        </div>
        <br />
        <p className="text-center text-xs text-gray-500">
          Powered by{' '}
          <a href="https://getgrowly.app" className="underline">
            Growly Suite
          </a>
        </p>
      </div>
    </div>
  );
}
