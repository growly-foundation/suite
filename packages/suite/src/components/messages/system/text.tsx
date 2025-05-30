import { TextMessageContent } from '@getgrowly/core';

export const TextMessage = ({ content }: { content: TextMessageContent['content'] }) => {
  return (
    <p className="text-sm" style={{ margin: 0 }}>
      <span className="flex items-center space-x-2">
        <div>{content}</div>
      </span>
    </p>
  );
};

export const buildTextMessage = (content: TextMessageContent['content']) => {
  return <TextMessage content={content} />;
};
