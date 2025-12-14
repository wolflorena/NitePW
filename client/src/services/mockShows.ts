export type ShowStatus = "On going" | "Ended" | "Canceled";

export type Show = {
  id: number;
  name: string;
  poster: string;
  likes: number;

  daysUntilNewSeason?: number;
  seasons?: number;
  newSeason?: string;

  status?: ShowStatus;
  totalEpisodes?: number;
};

export const mockShows: Show[] = [
  {
    id: 1,
    name: "Breaking Bad",
    poster: "card_breakingbad.png",
    likes: 999,
    daysUntilNewSeason: 0,
    seasons: 5,
    newSeason: "—",
    status: "Ended",
    totalEpisodes: 62,
  },
  {
    id: 2,
    name: "American Horror Story",
    poster: "card_ahs.jpg",
    likes: 850,
    daysUntilNewSeason: 40,
    seasons: 12,
    newSeason: "22.01.2026",
    status: "On going",
    totalEpisodes: 120,
  },
  {
    id: 3,
    name: "Wednesday",
    poster: "card_wednesday.jpg",
    likes: 770,
    daysUntilNewSeason: 78,
    seasons: 1,
    newSeason: "10.03.2026",
    status: "On going",
    totalEpisodes: 8,
  },
  {
    id: 4,
    name: "Arcane",
    poster: "card_arcane.png",
    likes: 690,
    daysUntilNewSeason: 35,
    seasons: 1,
    newSeason: "20.01.2026",
    status: "On going",
    totalEpisodes: 9,
  },
  {
    id: 5,
    name: "Control Z",
    poster: "card_controlz.png",
    likes: 610,
    daysUntilNewSeason: 0,
    seasons: 3,
    newSeason: "—",
    status: "Ended",
    totalEpisodes: 24,
  },
  {
    id: 6,
    name: "Jeffrey Dahmer",
    poster: "card_dahmer.jpg",
    likes: 520,
    daysUntilNewSeason: 0,
    seasons: 1,
    newSeason: "—",
    status: "Ended",
    totalEpisodes: 10,
  },
  {
    id: 7,
    name: "Muted",
    poster: "card_muted.jpeg",
    likes: 450,
    daysUntilNewSeason: 20,
    seasons: 1,
    newSeason: "03.01.2026",
    status: "Canceled",
    totalEpisodes: 8,
  },
];
