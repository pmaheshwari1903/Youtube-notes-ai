'use client';

import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-6 space-y-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="h-5 w-5 text-red-400" />
        </motion.div>
        <span className="text-sm text-red-400 font-medium">AI is generating your notes...</span>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 bg-white/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />
          <Skeleton className="h-4 w-4/6 bg-white/5" />
        </div>
        <Skeleton className="h-6 w-1/2 bg-white/5" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-5/6 bg-white/5" />
          <Skeleton className="h-4 w-2/3 bg-white/5" />
        </div>
        <Skeleton className="h-24 w-full bg-white/5 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-4/5 bg-white/5" />
        </div>
      </div>
    </motion.div>
  );
}
