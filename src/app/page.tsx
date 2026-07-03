'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Header } from '@/components/header';
import { UrlInput } from '@/components/url-input';
import { OptionsPanel } from '@/components/options-panel';
import { TranscriptPreview } from '@/components/transcript-preview';
import { NotesViewer } from '@/components/notes-viewer';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { GenerateOptions } from '@/types';

const defaultOptions: GenerateOptions = {
  language: 'english',
  noteLength: 'medium',
  tone: 'beginner',
  outputStyle: 'bullet-notes',
  customInstructions: '',
  includeOptions: {
    summary: true,
    keyConcepts: true,
    examples: false,
    interviewQuestions: false,
    mcqs: false,
    definitions: false,
    codeExamples: false,
    tables: false,
  },
};

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [options, setOptions] = useState<GenerateOptions>(defaultOptions);
  const [notes, setNotes] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleTranscriptFetched = (fetchedTranscript: string, title: string) => {
    setTranscript(fetchedTranscript);
    setVideoTitle(title);
    setNotes('');
  };

  const handleGenerate = useCallback(async () => {
    if (!transcript) {
      toast.error('Please fetch a transcript first');
      return;
    }

    setIsGenerating(true);
    setIsStreaming(true);
    setNotes('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          videoTitle,
          options,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || 'Failed to generate notes');
        setIsGenerating(false);
        setIsStreaming(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        toast.error('Failed to read response stream');
        setIsGenerating(false);
        setIsStreaming(false);
        return;
      }

      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setNotes(accumulated);
      }

      setIsStreaming(false);
      setIsGenerating(false);
      toast.success('Notes generated successfully!');
    } catch {
      toast.error('Something went wrong while generating notes');
      setIsGenerating(false);
      setIsStreaming(false);
    }
  }, [transcript, videoTitle, options]);

  return (
    <div className="relative min-h-screen">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-rose-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/3 blur-[150px]" />
      </div>

      <Header />

      <main className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* URL Input Hero */}
        <UrlInput
          onTranscriptFetched={handleTranscriptFetched}
          isLoading={isFetching}
          setIsLoading={setIsFetching}
        />

        {/* Transcript Preview */}
        <AnimatePresence>
          {transcript && (
            <TranscriptPreview transcript={transcript} title={videoTitle} />
          )}
        </AnimatePresence>

        {/* Options Panel */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <OptionsPanel options={options} onChange={setOptions} />

              {/* Generate Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex justify-center"
              >
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !transcript}
                  size="lg"
                  className="h-14 px-10 text-base bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-500 hover:via-rose-500 hover:to-orange-500 text-white shadow-xl shadow-red-500/20 transition-all duration-300 rounded-xl"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Generating Notes...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-5 w-5 mr-2" />
                      Generate Notes with AI
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeleton */}
        <AnimatePresence>
          {isGenerating && !notes && <LoadingSkeleton />}
        </AnimatePresence>

        {/* Notes Viewer */}
        <AnimatePresence>
          {notes && (
            <NotesViewer
              notes={notes}
              isStreaming={isStreaming}
              onRegenerate={handleGenerate}
            />
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 text-sm text-muted-foreground"
        >
          Built with Next.js, React, TypeScript, Tailwind CSS, Base UI, Framer Motion, and Groq AI. Paste a YouTube URL to generate personalized AI-powered notes from video transcripts.
        </motion.footer>
      </main>
    </div>
  );
}
