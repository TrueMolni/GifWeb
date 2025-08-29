import {
  GiphySearchResponse,
  GiphyDetailsResponse,
  GiphyGif,
  Gif,
  SearchParams,
  SearchResult,
} from "../types/giphy";

const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs";

/*  ---------------------------
 *  Обробник помилки для API
 *  --------------------------*/
class GiphyApiError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "GiphyApiError";
  }
}

/*  ---------------------------
 *  Кешування (in-memory + sessionStorage) з TTL
 *  --------------------------*/
type CacheEntry<T> = { value: T; ts: number };
const MEMORY = new Map<string, CacheEntry<any>>();
const TTL_MS = 10 * 60 * 1000; // 10 хв

function cacheKey(id: string) {
  return `gif:${id}`;
}

function getFromMemory<T>(key: string): T | null {
  const e = MEMORY.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > TTL_MS) return null;
  return e.value as T;
}

function getFromSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.value;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, value: T) {
  const entry: CacheEntry<T> = { value, ts: Date.now() };
  MEMORY.set(key, entry);
  try {
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // ігноруємо помилки (наприклад, якщо sessionStorage недоступний)
  }
}

/*  ---------------------------
 *  Утиліти мапінгу/парсингу
 *  --------------------------*/
const safeNum = (s?: string) => {
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const firstUrl = (...candidates: Array<{ url?: string } | undefined>) =>
  candidates.find((c) => c?.url)?.url;

const normalizeCreatedAt = (raw?: string) => {
  if (!raw || raw === "0000-00-00 00:00:00") return undefined;
  return raw;
};

/* Мапінг відповіді Giphy - внутрішня модель Gif */
const mapGiphyGifToGif = (g: GiphyGif): Gif => {
  const img = g.images;

  // Пріоритезуємо легші прев’ю (webp/still) для гріда
  const previewUrl =
    firstUrl(
      (img as any).preview_webp,
      img.fixed_width_small_still,
      img.preview_gif,
      img.fixed_height_small_still,
      img.fixed_height
    ) || img.original?.url;

  const original = img.original;
  const rawTitle = (g.title || "").trim();
  const title = rawTitle || (g.slug ? g.slug.replace(/-/g, " ") : "Untitled");

  return {
    id: g.id,
    title,
    slug: g.slug,
    url: g.url,
    previewUrl: previewUrl || original.url,
    originalUrl: original.url,
    downloadUrl: original.url,
    width: safeNum(original.width),
    height: safeNum(original.height),
    size: safeNum(original.size),
    rating: g.rating,
    createdAt: normalizeCreatedAt(g.import_datetime),
    source: g.source,
    user: g.user
      ? {
          username: g.user.username,
          displayName: g.user.display_name,
          profileUrl: g.user.profile_url,
          avatarUrl: g.user.avatar_url,
          isVerified: g.user.is_verified,
        }
      : undefined,

    tags: (g as any).tags,
  };
};

/*  ---------------------------
 *  HTTP: URL побудова + timeout + retry/backoff
 *  --------------------------*/
async function makeApiRequest<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  signal?: AbortSignal
): Promise<T> {
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
  if (!apiKey) throw new GiphyApiError("API key is required");

  // Будуємо абсолютний URL
  const url = new URL(
    path.startsWith("http") ? path : `${GIPHY_BASE_URL}${path}`
  );
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });
  url.searchParams.set("api_key", apiKey);

  // Тайм-аут 8с + зшивання сигналів
  const localController = new AbortController();
  const timeoutId = setTimeout(() => localController.abort(), 8000);
  const compositeController = new AbortController();
  const forwardAbort = () => compositeController.abort();
  localController.signal.addEventListener("abort", forwardAbort);
  signal?.addEventListener("abort", forwardAbort);

  let attempt = 0;
  const maxAttempts = 3;

  try {
    while (true) {
      try {
        const res = await fetch(url.toString(), {
          signal: compositeController.signal,
          headers: { Accept: "application/json" },
          cache: "default",
        });

        if (!res.ok) {
          if (
            [429, 500, 502, 503, 504].includes(res.status) &&
            attempt < maxAttempts - 1
          ) {
            attempt++;

            await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
            continue;
          }
          const msg =
            res.status === 401 || res.status === 403
              ? "Unauthorized: check your API key"
              : res.status === 429
                ? "Rate limit exceeded: please try again later"
                : `API request failed: ${res.status} ${res.statusText}`;
          throw new GiphyApiError(msg, res.status);
        }

        const data = await res.json();
        if (data?.meta && data.meta.status !== 200) {
          throw new GiphyApiError(
            data.meta.msg || "API error",
            data.meta.status
          );
        }
        return data as T;
      } catch (e: any) {
        if (e?.name === "AbortError") {
          throw new GiphyApiError("Request was cancelled");
        }

        if (!(e instanceof GiphyApiError) && attempt < maxAttempts - 1) {
          attempt++;
          await new Promise((r) => setTimeout(r, 300 * 2 ** attempt));
          continue;
        }
        throw e instanceof GiphyApiError
          ? e
          : new GiphyApiError(`Network error: ${e?.message || "unknown"}`);
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/*  ---------------------------
 *  Пошук
 *  --------------------------*/
export async function searchGifs(
  params: SearchParams,
  signal?: AbortSignal
): Promise<SearchResult> {
  const { query, limit = 24, offset = 0, rating = "g", lang = "en" } = params;

  const resp = await makeApiRequest<GiphySearchResponse>(
    "/search",
    { q: query, limit, offset, rating, lang },
    signal
  );

  const gifs = resp.data.map(mapGiphyGifToGif);
  const { total_count, count, offset: off } = resp.pagination;

  return {
    gifs,
    totalCount: total_count,
    hasMore: off + count < total_count,
    nextOffset: off + count,
  };
}

/*  ---------------------------
 *  Деталі по одному id (з кешем)
 *  --------------------------*/
export async function getGifById(
  id: string,
  signal?: AbortSignal
): Promise<Gif> {
  const key = cacheKey(id);
  const cached = getFromMemory<Gif>(key) ?? getFromSession<Gif>(key);
  if (cached) return cached;

  const resp = await makeApiRequest<GiphyDetailsResponse>(`/${id}`, {}, signal);
  const gif = mapGiphyGifToGif(resp.data);
  setCache(key, gif);
  return gif;
}

/*  ---------------------------
 *  Батч-завантаження за списком id
 *  --------------------------*/
export async function getGifsByIds(
  ids: string[],
  signal?: AbortSignal
): Promise<Gif[]> {
  const unique = Array.from(new Set(ids));
  if (unique.length === 0) return [];

  const fromCache: Gif[] = [];
  const toFetch: string[] = [];

  unique.forEach((id) => {
    const key = cacheKey(id);
    const cached = getFromMemory<Gif>(key) ?? getFromSession<Gif>(key);
    cached ? fromCache.push(cached) : toFetch.push(id);
  });

  let fetched: Gif[] = [];
  if (toFetch.length) {
    // Якщо лише один id - робимо запит на деталі, інакше - батч-запит
    if (toFetch.length === 1) {
      const resp = await makeApiRequest<GiphyDetailsResponse>(
        `/${toFetch[0]}`,
        {},
        signal
      );
      fetched = [mapGiphyGifToGif(resp.data)];
    } else {
      const resp = await makeApiRequest<{ data: GiphyGif[] }>(
        "",
        { ids: toFetch.join(",") },
        signal
      );
      fetched = resp.data.map(mapGiphyGifToGif);
    }
    fetched.forEach((g) => setCache(cacheKey(g.id), g));
  }

  const combined = [...fromCache, ...fetched];
  // Зберігаємо порядок згідно з початковим масивом ids
  combined.sort((a, b) => unique.indexOf(a.id) - unique.indexOf(b.id));
  return combined;
}

export { GiphyApiError };
