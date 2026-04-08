import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(filePath) {
  const content = readFileSync(filePath, 'utf8');
  const env = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const index = line.indexOf('=');
    if (index === -1) continue;

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function normalizeUrl(rawValue, defaultPort) {
  const value = rawValue?.trim();
  if (!value) return null;

  const url = new URL(value.includes('://') ? value : `http://${value}`);
  if (!url.port && defaultPort) {
    url.port = String(defaultPort);
  }

  return url.toString();
}

async function checkJson(url, init, label) {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`${label} responded with ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function main() {
  const envPath = resolve(process.cwd(), '.env.local');
  const env = loadEnvFile(envPath);

  const chromaUrl = normalizeUrl(env.CHROMA_URL ?? 'http://localhost:8000', 8000);
  const ollamaUrl = normalizeUrl(env.SERVER_ENDPOINT ?? 'http://localhost:11434', 11434);
  const embeddingModel = env.OLLAMA_EMBEDDING_MODEL;

  if (!embeddingModel) {
    throw new Error('OLLAMA_EMBEDDING_MODEL is missing from .env.local');
  }

  console.log(`Checking Chroma at ${chromaUrl}`);
  const chromaHeartbeat = await checkJson(
    new URL('/api/v2/heartbeat', chromaUrl),
    undefined,
    'Chroma'
  );
  console.log('Chroma OK:', JSON.stringify(chromaHeartbeat));

  console.log(`Checking Ollama at ${ollamaUrl}`);
  const ollamaTags = await checkJson(new URL('/api/tags', ollamaUrl), undefined, 'Ollama');
  const models = Array.isArray(ollamaTags?.models) ? ollamaTags.models.map((m) => m.name) : [];

  if (!models.includes(embeddingModel)) {
    throw new Error(
      `Ollama is reachable, but model "${embeddingModel}" is not installed. Found: ${models.join(', ') || 'none'}`
    );
  }

  console.log(`Ollama OK: found embedding model "${embeddingModel}"`);

  const embeddings = await checkJson(
    new URL('/api/embeddings', ollamaUrl),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: embeddingModel,
        prompt: 'health check',
      }),
    },
    'Ollama embeddings'
  );

  if (!Array.isArray(embeddings?.embedding) || embeddings.embedding.length === 0) {
    throw new Error(`Ollama embeddings returned an unexpected payload: ${JSON.stringify(embeddings)}`);
  }

  console.log(`Embeddings OK: vector length ${embeddings.embedding.length}`);
  console.log('All services are reachable and ready.');
}

main().catch((error) => {
  console.error('Service check failed.');
  if (error instanceof Error) {
    console.error(error.message);
    const cause = error.cause;
    if (cause instanceof Error) {
      console.error(cause.message);
    }
  } else {
    console.error(error);
  }
  process.exit(1);
});
