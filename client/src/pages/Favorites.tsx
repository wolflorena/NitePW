import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Favorites.module.css";

const API = "http://localhost:8080";

export default function Favorites() {
  const [query, setQuery] = useState("");
  const [favoriteShows, setFavoriteShows] = useState<any[]>([]);
  const userId = Number(localStorage.getItem("idUser") || "0");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`${API}/users/${userId}/favorites`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFavoriteShows(data);
        } else {
          setFavoriteShows([]);
        }
      } catch {
        setFavoriteShows([]);
      }
    })();
  }, [userId, token]);

  const filteredShows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favoriteShows;
    return favoriteShows.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, favoriteShows]);

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
          {filteredShows.map((show) => (
            <Link key={show.id} to={`/tvshow/${show.id}`}>
              <div className={styles.card}>
                <img src={`${show.poster}`} alt={show.name} />
                <h3>{show.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
