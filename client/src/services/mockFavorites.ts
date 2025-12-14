export type Favorite = {
  userId: number;
  tvShowId: number;
};

export const favorites: Favorite[] = [
  { userId: 2, tvShowId: 1 },
  { userId: 2, tvShowId: 4 },
  { userId: 2, tvShowId: 7 },
];
