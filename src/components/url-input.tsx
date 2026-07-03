'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Loader2, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface UrlInputProps {
  onTranscriptFetched: (transcript: string, title: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function UrlInput({ onTranscriptFetched, isLoading, setIsLoading }: UrlInputProps) {
  const [url, setUrl] = useState('');

  const handleFetch = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.error || 'Failed to fetch transcript');
        return;
      }

      onTranscriptFetched(data.transcript, data.title);
      toast.success('Transcript fetched successfully!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative"
    >
      {/* Gradient glow background */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-red-500/20 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-rose-500/20 blur-[100px]" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-8">
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 mb-4"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Notes Generator
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-red-100 to-rose-200 bg-clip-text text-transparent">
            Transform YouTube Videos into Smart Notes
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Paste any YouTube URL and let AI generate personalized study notes in seconds
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Play className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              className="pl-11 h-12 bg-background/50 border-white/10 text-base placeholder:text-muted-foreground/50"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleFetch}
            disabled={isLoading || !url.trim()}
            className="h-12 px-6 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Fetching...</>
            ) : (
              <><Link className="h-4 w-4 mr-2" /> Fetch Transcript</>
            )}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
