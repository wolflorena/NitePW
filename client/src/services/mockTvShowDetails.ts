export type TvShowDetails = {
  id: number;
  logo: string;
  banner: string;
  streaming: string;
  year: string;
  audience: string;
  seasons: number;
  status: "On going" | "Ended" | "Canceled";
  description: string;
};

export type Season = { id: number; tvShowId: number; name: string };
export type Episode = {
  id: number;
  tvShowId: number;
  seasonId: number;
  name: string;
};

export const tvShowDetailsById: Record<number, TvShowDetails> = {
  4: {
    id: 4,
    logo: "dahmer_title.png",
    banner: "dahmer_tvshow.png",
    streaming: "netflix.png",
    year: "2021",
    audience: "TV-MA",
    seasons: 1,
    status: "On going",
    description:
      "Amid the clash of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magical technologies and clashing convictions.",
  },
  1: {
    id: 1,
    logo: "logo_breakingbad.png",
    banner: "banner_breakingbad.jpg",
    streaming: "netflix",
    year: "2008",
    audience: "TV-MA",
    seasons: 5,
    status: "Ended",
    description:
      "A chemistry teacher diagnosed with cancer turns to manufacturing methamphetamine to secure his family's future.",
  },
};

export const seasonsByShowId: Record<number, Season[]> = {
  4: [
    { id: 401, tvShowId: 4, name: "Season 1" },
    { id: 402, tvShowId: 4, name: "Season 2" },
  ],
  1: [
    { id: 101, tvShowId: 1, name: "Season 1" },
    { id: 102, tvShowId: 1, name: "Season 2" },
  ],
};

export const episodesBySeasonId: Record<number, Episode[]> = {
  401: [
    { id: 40101, tvShowId: 4, seasonId: 401, name: "Welcome to Piltover" },
    { id: 40102, tvShowId: 4, seasonId: 401, name: "Some Mysteries" },
    {
      id: 40103,
      tvShowId: 4,
      seasonId: 401,
      name: "The Base Violence Necessary",
    },
  ],
  402: [
    { id: 40201, tvShowId: 4, seasonId: 402, name: "New Threats" },
    { id: 40202, tvShowId: 4, seasonId: 402, name: "Old Wounds" },
  ],
  101: [
    { id: 10101, tvShowId: 1, seasonId: 101, name: "Pilot" },
    { id: 10102, tvShowId: 1, seasonId: 101, name: "Cat's in the Bag..." },
  ],
  102: [{ id: 10201, tvShowId: 1, seasonId: 102, name: "Seven Thirty-Seven" }],
};
