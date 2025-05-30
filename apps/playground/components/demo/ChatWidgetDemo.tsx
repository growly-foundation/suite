import dynamic from 'next/dynamic';

import { ChatWidgetDemoLayout } from './ChatWidgetDemoLayout';

const ChatWidget = dynamic(() => import('@getgrowly/suite').then(suite => suite.ChatWidget), {
  ssr: false,
});

export function ChatWidgetDemo() {
  return (
    <ChatWidgetDemoLayout>
      <ChatWidget />
    </ChatWidgetDemoLayout>
  );
}
