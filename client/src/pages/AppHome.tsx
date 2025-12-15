import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AppHome.module.css";
import { type Show } from "../services/mockShows";
import Sidebar from "../components/Sidebar";
import { errorAlert } from "../services/alert";

export default function AppHome() {
  const [shows, setShows] = useState<Show[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchFavoritesShows = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await fetch("http://localhost:8080/tvshows/popular", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await response.json();

        console.log("Fetched shows:", data);
        if (!response.ok) {
          errorAlert(data?.message || "Failed to load TV shows");
          return;
        }
        setShows(data);
      } catch {
        errorAlert("Network/server error while loading TV shows");
      }
    };

    fetchFavoritesShows();
  }, []);

  const filteredShows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shows;
    return shows.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, shows]);

  const popularTop5 = useMemo(() => {
    return [...filteredShows].slice(0, 5);
  }, [filteredShows]);

  const exploreTop5 = useMemo(() => filteredShows.slice(0, 5), [filteredShows]);

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

        <div className={styles.movies}>
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Popular</h1>
              <h3>
                <Link to="/allshows">See all..</Link>
              </h3>
            </div>

            <div className={styles.cards}>
              {popularTop5.map((show) => (
                <Link key={show.id} to={`/tvshow/${show.id}`}>
                  <div className={styles.card}>
                    <img src={`${show.poster}`} alt={show.name} />
                    <h3>{show.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Explore</h1>
              <h3>
                <Link to="/allshows">See all..</Link>
              </h3>
            </div>

            <div className={styles.cards}>
              {exploreTop5.map((show) => (
                <Link key={show.id} to={`/tvshow/${show.id}`}>
                  <div className={styles.card}>
                    <img src={`${show.poster}`} alt={show.name} />
                    <h3>{show.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
