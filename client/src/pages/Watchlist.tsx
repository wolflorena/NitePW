import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Watchlist.module.css";
import {
  type WatchlistCard,
  getCurrentlyWatching,
  getFinished,
  getNotStarted,
  getUpToDate,
} from "../services/watchlistApi";

type SectionState = {
  loading: boolean;
  error: string | null;
  items: WatchlistCard[];
};

export default function Watchlist() {
  const [query, setQuery] = useState("");
  const userId = Number(localStorage.getItem("idUser") || "0");

  const [currentlyWatching, setCurrentlyWatching] = useState<SectionState>({
    loading: true,
    error: null,
    items: [],
  });
  const [notStarted, setNotStarted] = useState<SectionState>({
    loading: true,
    error: null,
    items: [],
  });
  const [upToDate, setUpToDate] = useState<SectionState>({
    loading: true,
    error: null,
    items: [],
  });
  const [finished, setFinished] = useState<SectionState>({
    loading: true,
    error: null,
    items: [],
  });

  // fetch all 4 sections once on mount
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [cw, ns, utd, fin] = await Promise.all([
          getCurrentlyWatching(userId, 5),
          getNotStarted(userId, 5),
          getUpToDate(userId, 5),
          getFinished(userId, 5),
        ]);

        if (cancelled) return;

        setCurrentlyWatching({
          loading: false,
          error: null,
          items: cw as WatchlistCard[],
        });
        setNotStarted({
          loading: false,
          error: null,
          items: ns as WatchlistCard[],
        });
        setUpToDate({
          loading: false,
          error: null,
          items: utd as WatchlistCard[],
        });
        setFinished({
          loading: false,
          error: null,
          items: fin as WatchlistCard[],
        });
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to load watchlist";

        setCurrentlyWatching((s) => ({ ...s, loading: false, error: msg }));
        setNotStarted((s) => ({ ...s, loading: false, error: msg }));
        setUpToDate((s) => ({ ...s, loading: false, error: msg }));
        setFinished((s) => ({ ...s, loading: false, error: msg }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // frontend search filter (since backend returns only 5)
  const q = query.trim().toLowerCase();
  const filterByQuery = (items: WatchlistCard[]) =>
    !q ? items : items.filter((x) => x.name?.toLowerCase().includes(q));

  const data = useMemo(() => {
    return {
      currentlyWatching: filterByQuery(currentlyWatching.items),
      notStarted: filterByQuery(notStarted.items),
      upToDate: filterByQuery(upToDate.items),
      finished: filterByQuery(finished.items),
    };
  }, [
    q,
    currentlyWatching.items,
    notStarted.items,
    upToDate.items,
    finished.items,
  ]);

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
          {/* Currently Watching */}
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Currently watching</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            {currentlyWatching.error && <p>{currentlyWatching.error}</p>}
            <div className={styles.cards}>
              {currentlyWatching.loading
                ? null
                : data.currentlyWatching.map((item) => (
                    <Link key={item.tvShowId} to={`/tvshow/${item.tvShowId}`}>
                      <div className={styles.card}>
                        <img src={item.poster} alt={item.name} />
                        {/* backend does not return percent; remove pie or compute if you add fields */}
                        <h3>{item.name}</h3>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>

          {/* Not Started */}
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Not started yet</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            {notStarted.error && <p>{notStarted.error}</p>}
            <div className={styles.cards}>
              {notStarted.loading
                ? null
                : data.notStarted.map((show) => (
                    <Link key={show.tvShowId} to={`/tvshow/${show.tvShowId}`}>
                      <div className={styles.card}>
                        <img src={show.poster} alt={show.name} />
                        <h3>{show.name}</h3>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>

          {/* Up To Date */}
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Up to date</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            {upToDate.error && <p>{upToDate.error}</p>}
            <div className={styles.cards}>
              {upToDate.loading
                ? null
                : data.upToDate.map((item) => (
                    <Link key={item.tvShowId} to={`/tvshow/${item.tvShowId}`}>
                      <div className={styles.card}>
                        <img src={item.poster} alt={item.name} />
                        <h3>{item.name}</h3>
                      </div>
                    </Link>
                  ))}
            </div>
          </section>

          {/* Finished */}
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Finished</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            {finished.error && <p>{finished.error}</p>}
            <div className={styles.cards}>
              {finished.loading
                ? null
                : data.finished.map((item) => (
                    <Link key={item.tvShowId} to={`/tvshow/${item.tvShowId}`}>
                      <div className={styles.card}>
                        <img src={item.poster} alt={item.name} />
                        <h3>{item.name}</h3>
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
