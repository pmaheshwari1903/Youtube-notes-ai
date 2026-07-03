export type Language = 'english' | 'hindi' | 'hinglish' | 'tamil' | 'telugu' | 'bengali' | 'marathi' | 'custom';

export type NoteLength = 'short' | 'medium' | 'detailed';

export type Tone = 'beginner' | 'professional' | 'exam-ready' | 'interview-ready' | 'teacher-style' | 'friendly';

export type OutputStyle = 'bullet-notes' | 'paragraph' | 'revision-notes' | 'cheat-sheet';

export interface GenerateOptions {
  language: Language;
  customLanguage?: string;
  noteLength: NoteLength;
  tone: Tone;
  outputStyle: OutputStyle;
  customInstructions?: string;
  includeOptions: {
    summary: boolean;
    keyConcepts: boolean;
    examples: boolean;
    interviewQuestions: boolean;
    mcqs: boolean;
    definitions: boolean;
    codeExamples: boolean;
    tables: boolean;
  };
}

export interface TranscriptResponse {
  success: boolean;
  transcript?: string;
  title?: string;
  error?: string;
}

export interface GenerateRequest {
  transcript: string;
  videoTitle: string;
  options: GenerateOptions;
}
