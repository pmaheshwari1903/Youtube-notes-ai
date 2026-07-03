import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts';
import { GenerateOptions } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key_for_build',
      baseURL: 'https://api.groq.com/openai/v1',
    });
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY is not configured. Please add it to your .env.local file.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { transcript, videoTitle, options } = (await req.json()) as {
      transcript: string;
      videoTitle: string;
      options: GenerateOptions;
    };

    if (!transcript) {
      return new Response(
        JSON.stringify({ error: 'Transcript is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = buildSystemPrompt(options);
    const userPrompt = buildUserPrompt(transcript, videoTitle);

    // Truncate transcript if too long (keep ~12000 chars to stay within context limits)
    const maxTranscriptLength = 12000;
    const truncatedUserPrompt = userPrompt.length > maxTranscriptLength
      ? userPrompt.slice(0, maxTranscriptLength) + '\n\n[Transcript truncated due to length...]'
      : userPrompt;

    const stream = await groq.chat.completions.create({
      model: 'openai/gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: truncatedUserPrompt },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 4096,
    });

    // Create a ReadableStream from the OpenAI stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: unknown) {
    console.error('Generate error:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate notes';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
