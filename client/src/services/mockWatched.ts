export type Watched = {
  userId: number;
  tvShowId: number;
  seasonId: number;
  episodeId: number;
};

export const watched: Watched[] = [
  { userId: 2, tvShowId: 4, seasonId: 401, episodeId: 40101 },
  { userId: 2, tvShowId: 4, seasonId: 401, episodeId: 40102 },
  { userId: 2, tvShowId: 1, seasonId: 101, episodeId: 10101 },
];
