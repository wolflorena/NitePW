type Stored = {
  favorites: number[];
  added: number[];
  watchedEpisodes: number[];
};

const key = (userId: number) => `nite:${userId}:lists`;

const read = (userId: number): Stored => {
  const raw = localStorage.getItem(key(userId));
  if (!raw) return { favorites: [], added: [], watchedEpisodes: [] };
  try {
    return JSON.parse(raw) as Stored;
  } catch {
    return { favorites: [], added: [], watchedEpisodes: [] };
  }
};

const write = (userId: number, data: Stored) => {
  localStorage.setItem(key(userId), JSON.stringify(data));
};

export const isFavorite = (userId: number, showId: number) =>
  read(userId).favorites.includes(showId);

export const toggleFavorite = (userId: number, showId: number) => {
  const data = read(userId);
  const exists = data.favorites.includes(showId);
  data.favorites = exists
    ? data.favorites.filter((x) => x !== showId)
    : [...data.favorites, showId];
  write(userId, data);
  return !exists;
};

export const isAdded = (userId: number, showId: number) =>
  read(userId).added.includes(showId);

export const toggleAdded = (userId: number, showId: number) => {
  const data = read(userId);
  const exists = data.added.includes(showId);
  data.added = exists
    ? data.added.filter((x) => x !== showId)
    : [...data.added, showId];
  write(userId, data);
  return !exists;
};

export const isEpisodeWatched = (userId: number, episodeId: number) =>
  read(userId).watchedEpisodes.includes(episodeId);

export const toggleEpisodeWatched = (userId: number, episodeId: number) => {
  const data = read(userId);
  const exists = data.watchedEpisodes.includes(episodeId);
  data.watchedEpisodes = exists
    ? data.watchedEpisodes.filter((x) => x !== episodeId)
    : [...data.watchedEpisodes, episodeId];
  write(userId, data);
  return !exists;
};

export const getWatchedEpisodeIds = (userId: number) =>
  read(userId).watchedEpisodes;
