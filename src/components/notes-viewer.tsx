'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Copy, Check, Download, RefreshCw, FileText, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from './markdown-renderer';
import { toast } from 'sonner';

interface NotesViewerProps {
  notes: string;
  isStreaming: boolean;
  onRegenerate: () => void;
}

export function NotesViewer({ notes, isStreaming, onRegenerate }: NotesViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(notes);
    setCopied(true);
    toast.success('Notes copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([notes], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Markdown file downloaded!');
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Text file downloaded!');
  };

  const wordCount = notes.split(/\s+/).filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20">
            <Sparkles className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h2 className="font-semibold">Generated Notes</h2>
            <div className="flex items-center gap-2 mt-0.5">
              {isStreaming ? (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 animate-pulse">
                  â— Generating...
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                  {wordCount} words
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!isStreaming && notes && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="hover:bg-white/10"
            >
              {copied ? (
                <><Check className="h-4 w-4 mr-1.5" /> Copied</>
              ) : (
                <><Copy className="h-4 w-4 mr-1.5" /> Copy</>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadMd}
              className="hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-1.5" /> .md
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadTxt}
              className="hover:bg-white/10"
            >
              <FileText className="h-4 w-4 mr-1.5" /> .txt
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/10" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" /> Regenerate
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <ScrollArea className="h-[500px] md:h-[600px]">
        <div className="p-6">
          <MarkdownRenderer content={notes} />
          {isStreaming && (
            <span className="inline-block w-2 h-5 bg-red-400 animate-pulse ml-1 rounded-sm" />
          )}
        </div>
      </ScrollArea>
    </motion.div>
  );
}
