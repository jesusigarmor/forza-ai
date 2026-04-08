import { ChromaClient } from 'chromadb';

function getChromaClient() {
  const rawUrl = process.env.CHROMA_URL ?? 'http://localhost:8000';
  const url = rawUrl.includes('://') ? new URL(rawUrl) : new URL(`http://${rawUrl}`);

  return new ChromaClient({
    host: url.hostname,
    port: Number(url.port || 8000),
    ssl: url.protocol === 'https:',
  });
}

export const chroma = getChromaClient();

export async function getActivityCollection() {
  return chroma.getOrCreateCollection({
    name: process.env.CHROMA_EMBEDDING_DB_NAME ?? 'forza_activities',
    embeddingFunction: null,
  });
}
