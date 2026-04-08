import { Ollama } from 'ollama';
import { getActivityCollection } from './chroma';
import type { Activity } from './types';

function getOllama() {
  const rawHost = process.env.SERVER_ENDPOINT ?? 'http://localhost:11434';
  const normalized = rawHost.includes('://') ? rawHost : `http://${rawHost}`;
  const url = new URL(normalized);

  if (!url.port) {
    url.port = '11434';
  }

  return new Ollama({ host: url.toString() });
}

function activityToText(activity: Activity): string {
  return `On ${activity.date}, I completed a ${activity.distance} km ${activity.sportType} called "${activity.name}" in ${activity.duration} at ${activity.pace}.`;
}

export async function embedUserActivities(
  userId: number,
  activities: Activity[]
): Promise<void> {
  if (activities.length === 0) return;

  const ollama = getOllama();
  const collection = await getActivityCollection();

  // Embed in batches of 20 to avoid overwhelming Ollama
  const BATCH = 20;
  for (let i = 0; i < activities.length; i += BATCH) {
    const batch = activities.slice(i, i + BATCH);

    const embeddings = await Promise.all(
      batch.map((a) =>
        ollama
          .embeddings({ model: process.env.OLLAMA_EMBEDDING_MODEL!, prompt: activityToText(a) })
          .then((r) => r.embedding)
      )
    );

    await collection.upsert({
      ids: batch.map((a) => `${userId}_${a.id}`),
      documents: batch.map((a) => activityToText(a)),
      embeddings,
      metadatas: batch.map((a) => ({
        userId,
        activityId: a.id,
        sportType: a.sportType,
        date: a.date,
      })),
    });
  }
}

export async function hasEmbeddings(userId: number): Promise<boolean> {
  const collection = await getActivityCollection();
  const result = await collection.get({
    where: { userId },
    limit: 1,
  });
  return result.ids.length > 0;
}
