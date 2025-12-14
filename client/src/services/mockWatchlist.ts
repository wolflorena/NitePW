export type WatchedEpisode = {
  userId: number;
  tvShowId: number;
  episodeId: number;
};

export type AddedShow = {
  userId: number;
  tvShowId: number;
};

export const watchedEpisodes: WatchedEpisode[] = [
  { userId: 2, tvShowId: 3, episodeId: 1 },
  { userId: 2, tvShowId: 3, episodeId: 2 },
  { userId: 2, tvShowId: 3, episodeId: 5 },
  { userId: 2, tvShowId: 4, episodeId: 1 },
  { userId: 2, tvShowId: 2, episodeId: 120 },
];

export const addedShows: AddedShow[] = [
  { userId: 2, tvShowId: 3 },
  { userId: 2, tvShowId: 4 },
  { userId: 2, tvShowId: 2 },
  { userId: 2, tvShowId: 5 },
];
