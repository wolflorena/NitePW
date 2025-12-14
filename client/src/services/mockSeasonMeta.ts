export type SeasonMeta = {
  seasonId: number;
  tvShowId: number;
  durationEpisode: number; // minute
  numberOfEpisodes: number;
};

export const seasonMeta: SeasonMeta[] = [
  { tvShowId: 1, seasonId: 101, durationEpisode: 47, numberOfEpisodes: 7 },
  { tvShowId: 1, seasonId: 102, durationEpisode: 47, numberOfEpisodes: 13 },

  { tvShowId: 4, seasonId: 401, durationEpisode: 40, numberOfEpisodes: 3 },
  { tvShowId: 4, seasonId: 402, durationEpisode: 40, numberOfEpisodes: 2 },
];
