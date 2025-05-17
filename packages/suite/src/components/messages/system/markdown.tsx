import { TextMessageContent } from '@getgrowly/core';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

const cleanHTML = async (content: TextMessageContent['content']) =>
  DOMPurify.sanitize(await marked(content));

export const buildMarkdownMessage = (content: TextMessageContent['content']) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [html, setHtml] = useState('');

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    cleanHTML(content).then(html => setHtml(html));
  }, [content]);

  return (
    <p className="text-sm" style={{ margin: 0 }}>
      <div className="prose prose-sm dark:prose-invert max-w-none break-words">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </p>
  );
};
