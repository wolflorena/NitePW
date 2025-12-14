export type AdminEpisode = {
  id: number;
  tvShowId: number;
  seasonId: number;
  name: string;
};

export type AdminSeason = {
  id: number;
  tvShowId: number;
  name: string; // ex: "Season 1"
  numberOfEpisodes: number;
  durationEpisode: number; // minutes
};

type Db = {
  seasons: AdminSeason[];
  episodes: AdminEpisode[];
};

const LS_KEY = "nite:admin:seasons-episodes";

const seed: Db = {
  seasons: [
    {
      id: 401,
      tvShowId: 4,
      name: "Season 1",
      numberOfEpisodes: 9,
      durationEpisode: 42,
    },
  ],
  episodes: [
    { id: 1, tvShowId: 4, seasonId: 401, name: "Welcome to Piltover" },
    { id: 2, tvShowId: 4, seasonId: 401, name: "Some Mysteries" },
  ],
};

function readDb(): Db {
  const raw = localStorage.getItem(LS_KEY);

  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<Db>;

    const db: Db = {
      seasons: Array.isArray(parsed.seasons)
        ? (parsed.seasons as AdminSeason[])
        : [],
      episodes: Array.isArray(parsed.episodes)
        ? (parsed.episodes as AdminEpisode[])
        : [],
    };

    if (db.seasons.length === 0 && seed.seasons.length > 0)
      db.seasons = seed.seasons;
    if (db.episodes.length === 0 && seed.episodes.length > 0)
      db.episodes = seed.episodes;

    localStorage.setItem(LS_KEY, JSON.stringify(db));
    return db;
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
}

function writeDb(db: Db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

function nextId(items: { id: number }[]) {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

/** ---------------- SEASONS ---------------- */

export async function listSeasons(tvShowId: number) {
  const db = readDb();
  return db.seasons.filter((s) => s.tvShowId === tvShowId);
}

export async function addSeason(
  tvShowId: number,
  name: string,
  numberOfEpisodes: number,
  durationEpisode: number
) {
  const db = readDb();
  const season: AdminSeason = {
    id: nextId(db.seasons),
    tvShowId,
    name,
    numberOfEpisodes,
    durationEpisode,
  };
  db.seasons.push(season);
  writeDb(db);
  return season;
}

export async function updateSeason(
  seasonId: number,
  patch: Partial<Omit<AdminSeason, "id">>
) {
  const db = readDb();
  const idx = db.seasons.findIndex((s) => s.id === seasonId);
  if (idx < 0) throw new Error("Season not found");

  db.seasons[idx] = { ...db.seasons[idx], ...patch };
  writeDb(db);
  return db.seasons[idx];
}

export async function deleteSeasonById(tvShowId: number, seasonId: number) {
  const db = readDb();

  db.seasons = db.seasons.filter(
    (s) => !(s.tvShowId === tvShowId && s.id === seasonId)
  );

  db.episodes = db.episodes.filter(
    (e) => !(e.tvShowId === tvShowId && e.seasonId === seasonId)
  );

  writeDb(db);
}

/** ---------------- EPISODES ---------------- */

export async function listEpisodes(tvShowId: number, seasonId: number) {
  const db = readDb();
  return db.episodes.filter(
    (e) => e.tvShowId === tvShowId && e.seasonId === seasonId
  );
}

export async function updateEpisodeName(episodeId: number, name: string) {
  const db = readDb();
  const idx = db.episodes.findIndex((e) => e.id === episodeId);
  if (idx < 0) throw new Error("Episode not found");

  db.episodes[idx] = { ...db.episodes[idx], name };
  writeDb(db);

  return db.episodes[idx];
}

export async function addEpisode(
  tvShowId: number,
  seasonId: number,
  name: string
) {
  const db = readDb();
  const ep: AdminEpisode = {
    id: nextId(db.episodes),
    tvShowId,
    seasonId,
    name,
  };
  db.episodes.push(ep);
  writeDb(db);
  return ep;
}

export async function deleteEpisodeById(id: number) {
  const db = readDb();
  db.episodes = db.episodes.filter((e) => e.id !== id);
  writeDb(db);
}
