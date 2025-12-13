import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AppHome.module.css";
import { mockShows } from "../services/mockShows";
import Sidebar from "../components/Sidebar";

export default function AppHome() {
  const [query, setQuery] = useState("");

  const filteredShows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockShows;
    return mockShows.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

  const popularTop5 = useMemo(() => {
    return [...filteredShows].sort((a, b) => b.likes - a.likes).slice(0, 5);
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
                    <img src={`/img/${show.poster}`} alt={show.name} />
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
                    <img src={`/img/${show.poster}`} alt={show.name} />
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
