export type WatchlistCard = {
  tvShowId: number;
  name: string;
  poster: string;
  banner?: string;
  status?: string;
  progress?: {
    seasonId?: number;
    seasonName?: string;
    episodeId?: number;
    episodeName?: string;
  } | null;
  progressPercent?: number;
};

type PageResponse<T> = {
  content?: T[]; // Spring Page default
  items?: T[]; // if you return custom
  totalElements?: number;
  total?: number;
};

const API_BASE = "http://localhost:8080"; // or "" if same domain

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  const contentType = res.headers.get("content-type") || "";
  const raw = await res.text();

  if (!res.ok) {
    throw new Error(`GET ${path} failed (${res.status}): ${raw.slice(0, 200)}`);
  }
  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but got ${contentType}: ${raw.slice(0, 200)}`
    );
  }
  return JSON.parse(raw) as T;
}

function extractItems<T>(page: PageResponse<T>): T[] {
  if (Array.isArray(page.content)) return page.content;
  if (Array.isArray(page.items)) return page.items;
  return [];
}

export async function getCurrentlyWatching(userId: number, limit = 5) {
  const page = await apiGet<PageResponse<WatchlistCard>>(
    `/watchlist/${userId}/currently-watching?page=0&size=${limit}`
  );
  console.log("Currently Watching Page:", page);
  return extractItems(page);
}
export async function getNotStarted(userId: number, limit = 5) {
  const page = await apiGet<PageResponse<WatchlistCard>>(
    `/watchlist/${userId}/not-started?page=0&size=${limit}`
  );
  return extractItems(page);
}
export async function getUpToDate(userId: number, limit = 5) {
  const page = await apiGet<PageResponse<WatchlistCard>>(
    `/watchlist/${userId}/up-to-date?page=0&size=${limit}`
  );
  return extractItems(page);
}
export async function getFinished(userId: number, limit = 5) {
  const page = await apiGet<PageResponse<WatchlistCard>>(
    `/watchlist/${userId}/finished?page=0&size=${limit}`
  );
  return extractItems(page);
}
