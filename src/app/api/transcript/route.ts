import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid YouTube URL' },
        { status: 400 }
      );
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Could not extract video ID from the URL. Please check the URL and try again.' },
        { status: 400 }
      );
    }

    // Dynamically import youtube-transcript-plus
    const { YoutubeTranscript } = await import('youtube-transcript-plus');
    
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

    if (!transcriptItems || transcriptItems.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No transcript found for this video. The video may not have captions enabled.' },
        { status: 404 }
      );
    }

    // Combine transcript items into a single string
    const transcript = transcriptItems
      .map((item: { text: string }) => item.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Try to get video title from oEmbed API
    let title = 'YouTube Video';
    try {
      const oembedRes = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (oembedRes.ok) {
        const oembedData = await oembedRes.json();
        title = oembedData.title || title;
      }
    } catch {
      // Silently fail - title is optional
    }

    return NextResponse.json({
      success: true,
      transcript,
      title,
    });
  } catch (error) {
    console.error('Transcript fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transcript. Please make sure the video has captions available.',
      },
      { status: 500 }
    );
  }
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  // Check if the input itself is a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) {
    return url.trim();
  }

  return null;
}
