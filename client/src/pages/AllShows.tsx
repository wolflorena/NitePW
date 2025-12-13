import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AllShows.module.css";
import { mockShows } from "../services/mockShows";

import Sidebar from "../components/Sidebar";

export default function AllShows() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return mockShows;
    return mockShows.filter((s) => s.name.toLowerCase().includes(q));
  }, [query]);

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
          {filtered.map((show) => (
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
