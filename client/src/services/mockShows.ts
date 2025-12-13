export type Show = {
  id: number;
  name: string;
  poster: string;
  likes: number;
};

export const mockShows: Show[] = [
  { id: 1, name: "Breaking Bad", poster: "card_breakingbad.png", likes: 999 },
  { id: 2, name: "American Horror Story", poster: "card_ahs.jpg", likes: 850 },
  { id: 3, name: "Wednesday", poster: "card_wednesday.jpg", likes: 770 },
  { id: 4, name: "Arcane", poster: "card_arcane.png", likes: 690 },
  { id: 5, name: "Control Z", poster: "card_controlz.png", likes: 610 },
  { id: 6, name: "Jeffrey Dahmer", poster: "card_dahmer.jpg", likes: 520 },
  { id: 7, name: "Muted", poster: "card_muted.jpeg", likes: 450 },
];
