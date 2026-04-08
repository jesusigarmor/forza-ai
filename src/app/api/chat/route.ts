import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama';
import { getSession } from '@/lib/auth';
import { getActivityCollection } from '@/lib/chroma';

function getOllamaHost() {
  const rawHost = process.env.SERVER_ENDPOINT ?? 'http://localhost:11434';
  const normalized = rawHost.includes('://') ? rawHost : `http://${rawHost}`;
  const url = new URL(normalized);

  if (!url.port) {
    url.port = '11434';
  }

  return url.toString();
}

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message } = await request.json() as { message: string };
  if (!message?.trim()) return NextResponse.json({ error: 'Message required' }, { status: 400 });

  const ollama = new Ollama({ host: getOllamaHost() });

  // 1. Embed the question
  const { embedding } = await ollama.embeddings({
    model: process.env.OLLAMA_EMBEDDING_MODEL!,
    prompt: message,
  });

  // 2. Query ChromaDB — only this user's activities
  const collection = await getActivityCollection();
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: 5,
    where: { userId: user.id },
  });

  const context = results.documents[0]?.join('\n\n') ?? '';

  // 3. Stream LLM response
  const stream = await ollama.chat({
    model: process.env.OLLAMA_LLM_MODEL!,
    stream: true,
    messages: [
      {
        role: 'system',
        content:
          'You are a personal fitness coach named ForzaAI. Answer questions based only on the provided training activity context. Be concise, specific, and encouraging. If the context does not contain enough information, say so.',
      },
      {
        role: 'user',
        content: `Training context:\n${context}\n\nQuestion: ${message}`,
      },
    ],
  });

  // 4. Pipe Ollama stream → Response stream
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.message.content;
        if (text) controller.enqueue(new TextEncoder().encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
