import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface MarkdownRendererProps {
  content: string;
}

function CodeBlock({ className, children }: { className?: string; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const language = className?.replace('language-', '') || '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4">
      <div className="flex items-center justify-between bg-zinc-800/80 px-4 py-2 text-xs">
        <span className="text-zinc-400 font-mono">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="bg-zinc-900/80 p-4 overflow-x-auto">
        <code className={`text-sm font-mono ${className || ''}`}>{children}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mt-6 mb-4 bg-gradient-to-r from-red-300 to-rose-300 bg-clip-text text-transparent">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-rose-500" />
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-medium mt-4 mb-2 text-foreground/90">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-1.5 mb-4 ml-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-1.5 mb-4 ml-1 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-muted-foreground leading-relaxed flex items-start gap-2">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-foreground">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="text-red-300/90">{children}</em>
        ),
        code: ({ className, children, ...props }) => {
          const isBlock = className?.includes('language-');
          if (isBlock) {
            return <CodeBlock className={className}>{children}</CodeBlock>;
          }
          return (
            <code className="bg-red-500/10 text-red-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-red-500/50 bg-red-500/5 pl-4 py-2 my-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-red-500/10 border-b border-white/10">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-left font-medium text-red-300">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 text-muted-foreground border-t border-white/5">{children}</td>
        ),
        hr: () => (
          <hr className="my-6 border-white/10" />
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-rose-400 hover:text-rose-300 underline underline-offset-2 transition-colors">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
