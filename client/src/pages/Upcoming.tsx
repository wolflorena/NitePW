import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Upcoming.module.css";
import { mockShows, type Show } from "../services/mockShows";

export default function Upcoming() {
  const [query, setQuery] = useState("");

  const upcomingList = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = mockShows.filter((s) => {
      const days = s.daysUntilNewSeason ?? 0;
      const inRange = days > 0 && days < 101;
      const matches = !q || s.name.toLowerCase().includes(q);
      return inRange && matches;
    });

    return [...filtered].sort(
      (a, b) => (a.daysUntilNewSeason ?? 0) - (b.daysUntilNewSeason ?? 0)
    );
  }, [query]);

  const seasonLabel = (s: Show) => {
    const seasons = s.seasons ?? 0;
    return seasons + 1;
  };

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
          {upcomingList.map((show) => (
            <Link key={show.id} to={`/tvshow/${show.id}`}>
              <div className={styles.card}>
                <img src={`${show.poster}`} alt={show.name} />

                <div className={styles.cardTextCenter}>
                  <h3>{show.daysUntilNewSeason} days</h3>
                </div>

                <h3>{show.name}</h3>
                <h5>
                  Season {seasonLabel(show)} ○ {show.newSeason ?? ""}
                </h5>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
