import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm" {...props}>
      {children}
    </code>
  );
};

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-2xl rounded-lg p-4 ${
          isError
            ? 'bg-red-900/30 text-red-200 border border-red-700'
            : isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              code: CodeBlock,
              pre: ({ children }) => (
                <pre className="bg-gray-900 rounded-lg p-3 overflow-x-auto my-2">
                  {children}
                </pre>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-600 pl-4 italic my-2 opacity-75">
                  {children}
                </blockquote>
              ),
            }}
            className="prose prose-invert max-w-none text-sm leading-relaxed space-y-2"
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
