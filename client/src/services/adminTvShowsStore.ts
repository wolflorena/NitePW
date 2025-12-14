export type AdminTvShowStatus = "On going" | "Ended" | "Canceled";

export type AdminTvShow = {
  id: number;
  name: string;
  year: number;
  audience: string;
  seasons: number;
  genre: string;
  status: AdminTvShowStatus;
  description: string;
  streaming: string;
  likes: number;
  newSeason?: string | null;
  poster?: string;
  banner?: string;
  logo?: string;
};

const LS_KEY = "nite:admin:tvshows";

const seed: AdminTvShow[] = [
  {
    id: 1,
    name: "Breaking Bad",
    year: 2008,
    audience: "TV-MA",
    seasons: 5,
    genre: "Drama",
    status: "Ended",
    description:
      "A chemistry teacher diagnosed with cancer turns to cooking meth.",
    streaming: "netflix",
    likes: 999,
    newSeason: "",
  },
  {
    id: 4,
    name: "Arcane",
    year: 2021,
    audience: "TV-14",
    seasons: 1,
    genre: "Animation",
    status: "On going",
    description:
      "Sisters fight on rival sides of a war between magic and tech.",
    streaming: "netflix",
    likes: 690,
    newSeason: "20.01.2026",
  },
  {
    id: 7,
    name: "Muted",
    year: 2023,
    audience: "TV-MA",
    seasons: 1,
    genre: "Thriller",
    status: "Canceled",
    description: "A suspenseful story about silence and secrets.",
    streaming: "netflix",
    likes: 450,
    newSeason: null,
  },
];

function read(): AdminTvShow[] {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as AdminTvShow[];
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify(seed));
    return seed;
  }
}

function write(shows: AdminTvShow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(shows));
}

export async function listTvShows(): Promise<AdminTvShow[]> {
  return read();
}

export async function deleteTvShowById(showId: number): Promise<void> {
  write(read().filter((s) => s.id !== showId));
}

export async function getTvShowById(
  showId: number
): Promise<AdminTvShow | undefined> {
  return read().find((s) => s.id === showId);
}

export async function updateTvShow(
  showId: number,
  patch: Partial<AdminTvShow>
) {
  const all = read();
  const idx = all.findIndex((s) => s.id === showId);
  if (idx < 0) throw new Error("Show not found");
  all[idx] = { ...all[idx], ...patch, id: showId };
  write(all);
  return all[idx];
}

function nextId(items: { id: number }[]) {
  return items.length ? Math.max(...items.map((x) => x.id)) + 1 : 1;
}

export async function createTvShow(
  show: Omit<AdminTvShow, "id">
): Promise<AdminTvShow> {
  const all = read();
  const created: AdminTvShow = { ...show, id: nextId(all) };
  all.push(created);
  write(all);
  return created;
}
