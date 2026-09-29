function normalizeBaseUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getServerApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return normalizeBaseUrl(process.env.NEXT_PUBLIC_APP_URL);
  }

  if (process.env.VERCEL_URL) {
    return normalizeBaseUrl(`https://${process.env.VERCEL_URL}`);
  }

  return "http://localhost:3000";
}

export async function fetchServerApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getServerApiBaseUrl()}${path}`, init);

  if (!response.ok) {
    const error = new Error(`API request failed for ${path}`) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}
