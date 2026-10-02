import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  value: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-2xl overflow-hidden border border-slate-800/80 bg-[#0F172A] shadow-xl text-slate-100 font-mono text-xs sm:text-sm">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1E293B] border-b border-slate-700/60 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-semibold"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto leading-relaxed">
        <pre className="!bg-transparent !p-0 !m-0 font-mono text-xs sm:text-[13px] text-slate-200">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
};

export const MarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
  // Normalize triple single quotes ('''python) to standard triple backticks (```python)
  const normalizedContent = (content || '')
    .replace(/'''([a-zA-Z]*)\n([\s\S]*?)'''/g, '```$1\n$2```')
    .replace(/'''/g, '```');

  return (
    <div className="markdown-content text-slate-800 leading-relaxed text-sm sm:text-base space-y-4">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-6 mb-3 border-b border-purple-100 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-6 mb-3 text-purple-950">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold text-purple-900 tracking-tight mt-5 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-slate-800 mt-4 mb-2">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-slate-700 leading-relaxed text-sm sm:text-[15px] my-2.5">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1.5 pl-2 my-3 text-slate-700 text-sm sm:text-[15px]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 pl-2 my-3 text-slate-700 text-sm sm:text-[15px]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500 bg-purple-50/70 p-4 rounded-r-xl my-4 text-purple-950 font-medium italic">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-slate-900">
              {children}
            </strong>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-purple-100/80 text-purple-900 font-mono text-xs sm:text-[13px] font-semibold border border-purple-200/60"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : ''}
                value={String(children).replace(/\n$/, '')}
              />
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-xs">
              <table className="min-w-full divide-y divide-slate-200 text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-purple-50/80 text-purple-900 font-bold">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2.5 text-left font-bold text-purple-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-t border-slate-100 text-slate-700">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-semibold underline decoration-purple-300 underline-offset-2 hover:decoration-purple-600 transition-colors"
            >
              {children}
            </a>
          )
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
};
