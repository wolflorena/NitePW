import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Favorites.module.css";
import { mockShows } from "../services/mockShows";
import { favorites } from "../services/mockFavorites";

export default function Favorites() {
  const [query, setQuery] = useState("");
  const userId = Number(localStorage.getItem("idUser") || "0");

  const favoriteShows = useMemo(() => {
    const q = query.trim().toLowerCase();

    const favIds = favorites
      .filter((f) => f.userId === userId)
      .map((f) => f.tvShowId);

    const favSet = new Set(favIds);

    return mockShows
      .filter((s) => favSet.has(s.id))
      .filter((s) => !q || s.name.toLowerCase().includes(q));
  }, [query, userId]);

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <input
          type="text"
          className={styles.search}
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.cards}>
          {favoriteShows.map((show) => (
            <Link key={show.id} to={`/tvshow/${show.id}`}>
              <div className={styles.card}>
                <img src={`/img/${show.poster}`} alt={show.name} />
                <h3>{show.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
