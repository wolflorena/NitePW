import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AllShows.module.css";
import { type Show } from "../services/mockShows";

import Sidebar from "../components/Sidebar";
import { errorAlert } from "../services/alert";

export default function AllShows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await fetch("http://localhost:8080/tvshows", {
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

    fetchShows();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shows;
    return shows.filter((s) => s.name.toLowerCase().includes(q));
  }, [query, shows]);

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
