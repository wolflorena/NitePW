import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Upcoming.module.css";
import { mockShows, type Show } from "../services/mockShows";

export default function Upcoming() {
  const [query, setQuery] = useState("");
  const [upcomingList, setUpcomingList] = useState<Show[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/tvshows/upcoming`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUpcomingList(data);
        } else {
          setUpcomingList([]);
        }
      } catch {
        setUpcomingList([]);
      }
    })();
  }, []);

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
