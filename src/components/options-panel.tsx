'use client';

import { motion } from 'framer-motion';
import {
  Languages, Gauge, MessageSquare, FileText, Settings2, Wand2
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { GenerateOptions, Language, NoteLength, Tone, OutputStyle } from '@/types';

interface OptionsPanelProps {
  options: GenerateOptions;
  onChange: (options: GenerateOptions) => void;
}

const languages: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'hinglish', label: 'Hinglish' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'custom', label: 'Custom' },
];

const tones: { value: Tone; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'professional', label: 'Professional' },
  { value: 'exam-ready', label: 'Exam Ready' },
  { value: 'interview-ready', label: 'Interview Ready' },
  { value: 'teacher-style', label: 'Teacher Style' },
  { value: 'friendly', label: 'Friendly' },
];

const lengths: { value: NoteLength; label: string; desc: string }[] = [
  { value: 'short', label: 'Short', desc: '~500 words' },
  { value: 'medium', label: 'Medium', desc: '~1000 words' },
  { value: 'detailed', label: 'Detailed', desc: '1500+ words' },
];

const outputStyles: { value: OutputStyle; label: string }[] = [
  { value: 'bullet-notes', label: 'Bullet Notes' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'revision-notes', label: 'Revision Notes' },
  { value: 'cheat-sheet', label: 'Cheat Sheet' },
];

const includeCheckboxes: { key: keyof GenerateOptions['includeOptions']; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'keyConcepts', label: 'Key Concepts' },
  { key: 'examples', label: 'Examples' },
  { key: 'interviewQuestions', label: 'Interview Q&A' },
  { key: 'mcqs', label: 'MCQs' },
  { key: 'definitions', label: 'Definitions' },
  { key: 'codeExamples', label: 'Code Examples' },
  { key: 'tables', label: 'Tables' },
];

export function OptionsPanel({ options, onChange }: OptionsPanelProps) {
  const updateOption = <K extends keyof GenerateOptions>(key: K, value: GenerateOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const toggleInclude = (key: keyof GenerateOptions['includeOptions']) => {
    onChange({
      ...options,
      includeOptions: {
        ...options.includeOptions,
        [key]: !options.includeOptions[key],
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-card/50 backdrop-blur-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="h-5 w-5 text-red-400" />
        <h2 className="text-lg font-semibold">Customize Your Notes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Languages className="h-4 w-4 text-rose-400" />
            Language
          </Label>
          <Select
            value={options.language}
            onValueChange={(v) => updateOption('language', v as Language)}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {options.language === 'custom' && (
            <Input
              placeholder="Enter your language..."
              value={options.customLanguage || ''}
              onChange={(e) => updateOption('customLanguage', e.target.value)}
              className="bg-background/50 border-white/10"
            />
          )}
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4 text-rose-400" />
            Tone
          </Label>
          <Select
            value={options.tone}
            onValueChange={(v) => updateOption('tone', v as Tone)}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone.value} value={tone.value}>
                  {tone.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Length */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Gauge className="h-4 w-4 text-rose-400" />
            Note Length
          </Label>
          <Select
            value={options.noteLength}
            onValueChange={(v) => updateOption('noteLength', v as NoteLength)}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lengths.map((len) => (
                <SelectItem key={len.value} value={len.value}>
                  {len.label} ({len.desc})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Output Style */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FileText className="h-4 w-4 text-rose-400" />
            Output Style
          </Label>
          <Select
            value={options.outputStyle}
            onValueChange={(v) => updateOption('outputStyle', v as OutputStyle)}
          >
            <SelectTrigger className="bg-background/50 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {outputStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Include Options */}
      <div className="mt-6">
        <Label className="flex items-center gap-2 text-sm font-medium mb-3">
          <Wand2 className="h-4 w-4 text-red-400" />
          Include in Notes
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {includeCheckboxes.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleInclude(item.key)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 ${options.includeOptions[item.key]
                ? 'border-red-500/50 bg-red-500/10 text-red-300'
                : 'border-white/10 bg-background/30 text-muted-foreground hover:border-white/20 hover:bg-background/50'
                }`}
            >
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Instructions */}
      <div className="mt-6 space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="h-4 w-4 text-red-400" />
          Custom Instructions (Optional)
        </Label>
        <Textarea
          placeholder='e.g. "Explain in Hinglish using simple words and add real-world examples"'
          value={options.customInstructions || ''}
          onChange={(e) => updateOption('customInstructions', e.target.value)}
          className="bg-background/50 border-white/10 min-h-[80px] resize-none"
        />
      </div>
    </motion.div>
  );
}
