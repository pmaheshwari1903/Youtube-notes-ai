import { GenerateOptions } from '@/types';

const LANGUAGE_MAP: Record<string, string> = {
  english: 'English',
  hindi: 'Hindi',
  hinglish: 'Hinglish (mix of Hindi and English)',
  tamil: 'Tamil',
  telugu: 'Telugu',
  bengali: 'Bengali',
  marathi: 'Marathi',
};

const TONE_MAP: Record<string, string> = {
  'beginner': 'Use simple language suitable for beginners. Explain concepts from scratch with analogies.',
  'professional': 'Use professional and technical language. Be precise and concise.',
  'exam-ready': 'Focus on exam-relevant content. Include important points, definitions, and potential exam questions.',
  'interview-ready': 'Focus on interview-relevant topics. Include commonly asked questions and best answers.',
  'teacher-style': 'Explain like a teacher would in a classroom. Use step-by-step explanations.',
  'friendly': 'Use casual, friendly language. Make it fun and easy to understand.',
};

const LENGTH_MAP: Record<string, string> = {
  short: 'Keep notes concise and brief. Maximum 500 words. Focus only on the most critical points.',
  medium: 'Provide moderately detailed notes. Around 800-1200 words. Cover all important topics.',
  detailed: 'Provide comprehensive, detailed notes. 1500+ words. Cover everything thoroughly with examples.',
};

const STYLE_MAP: Record<string, string> = {
  'bullet-notes': 'Format as organized bullet points with clear headings and sub-points.',
  'paragraph': 'Format as well-structured paragraphs with clear topic sentences and transitions.',
  'revision-notes': 'Format as quick revision notes with key terms highlighted. Use short, memorable points.',
  'cheat-sheet': 'Format as a compact cheat sheet. Use tables, short definitions, and quick-reference format.',
};

export function buildSystemPrompt(options: GenerateOptions): string {
  const language = options.language === 'custom' && options.customLanguage
    ? options.customLanguage
    : LANGUAGE_MAP[options.language] || 'English';

  const sections: string[] = [];

  // Include options
  const includes = options.includeOptions;
  if (includes.summary) sections.push('- A clear summary of the content');
  if (includes.keyConcepts) sections.push('- Key concepts and main ideas');
  if (includes.examples) sections.push('- Real-world examples and analogies');
  if (includes.interviewQuestions) sections.push('- Potential interview questions with answers');
  if (includes.mcqs) sections.push('- Multiple choice questions (MCQs) with correct answers marked');
  if (includes.definitions) sections.push('- Important definitions and terminology');
  if (includes.codeExamples) sections.push('- Code examples where relevant (with syntax highlighting)');
  if (includes.tables) sections.push('- Comparison tables where applicable');

  const sectionsText = sections.length > 0
    ? `\n\nInclude the following sections:\n${sections.join('\n')}`
    : '';

  const customText = options.customInstructions
    ? `\n\nAdditional instructions from the user: ${options.customInstructions}`
    : '';

  return `You are an expert study assistant and note-taking AI. Generate high-quality study notes from the provided YouTube video transcript.

Language: Write all notes in ${language}.

Tone: ${TONE_MAP[options.tone]}

Length: ${LENGTH_MAP[options.noteLength]}

Format: ${STYLE_MAP[options.outputStyle]}
${sectionsText}${customText}

Rules:
- Use proper markdown formatting with headings (##, ###), bold, italic, lists, and code blocks
- Make the notes well-organized and easy to scan
- Extract the most valuable information from the transcript
- Add structure even if the original transcript is unstructured
- Use emojis sparingly to make notes visually appealing
- If the transcript mentions code, format it properly in code blocks with language specification
- Start directly with the notes content, no preamble like "Here are your notes"`;
}

export function buildUserPrompt(transcript: string, videoTitle: string): string {
  return `Video Title: ${videoTitle}\n\nTranscript:\n${transcript}`;
}
