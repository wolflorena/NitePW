import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./Watchlist.module.css";
import { mockShows, type Show } from "../services/mockShows";
import { addedShows, watchedEpisodes } from "../services/mockWatchlist";

type WatchItem = {
  show: Show;
  watchedCount: number;
  total: number;
  percent: number;
};

export default function Watchlist() {
  const [query, setQuery] = useState("");
  const userId = Number(localStorage.getItem("idUser") || "0");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();

    const showsById = new Map(mockShows.map((s) => [s.id, s]));

    const watchedForUser = watchedEpisodes.filter((w) => w.userId === userId);
    const addedForUser = addedShows.filter((a) => a.userId === userId);

    const watchedCountByShow = new Map<number, number>();
    for (const w of watchedForUser) {
      watchedCountByShow.set(
        w.tvShowId,
        (watchedCountByShow.get(w.tvShowId) ?? 0) + 1
      );
    }

    const watchedShowIds = Array.from(
      new Set(watchedForUser.map((w) => w.tvShowId))
    );

    const watchItems: WatchItem[] = watchedShowIds
      .map((id) => {
        const show = showsById.get(id);
        if (!show) return null;

        const watchedCount = watchedCountByShow.get(id) ?? 0;
        const total = show.totalEpisodes ?? 0;
        const percent = total > 0 ? (watchedCount * 100) / total : 0;

        return { show, watchedCount, total, percent };
      })
      .filter(Boolean) as WatchItem[];

    const matchesSearch = (s: Show) => !q || s.name.toLowerCase().includes(q);

    const currentlyWatching = watchItems
      .filter((x) => matchesSearch(x.show) && x.percent < 100)
      .slice(0, 5);

    const upToDate = watchItems
      .filter(
        (x) =>
          matchesSearch(x.show) &&
          x.percent === 100 &&
          x.show.status === "On going"
      )
      .slice(0, 5);

    const finished = watchItems
      .filter(
        (x) =>
          matchesSearch(x.show) &&
          x.percent === 100 &&
          (x.show.status === "Ended" || x.show.status === "Canceled")
      )
      .slice(0, 5);

    const watchedIdSet = new Set(watchedShowIds);
    const notStarted = addedForUser
      .map((a) => showsById.get(a.tvShowId))
      .filter((s): s is Show => !!s)
      .filter((s) => !watchedIdSet.has(s.id))
      .filter(matchesSearch)
      .slice(0, 5);

    return { currentlyWatching, upToDate, finished, notStarted };
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

        <div className={styles.movies}>
          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Currently watching</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            <div className={styles.cards}>
              {data.currentlyWatching.map((item) => (
                <Link key={item.show.id} to={`/tvshow/${item.show.id}`}>
                  <div className={styles.card}>
                    <img src={`${item.show.poster}`} alt={item.show.name} />
                    <div className={styles.pieContainer}>
                      <div
                        className={styles.pie}
                        style={{ ["--p" as never]: item.percent }}
                      >
                        {Math.ceil(item.percent)}%
                      </div>
                    </div>
                    <h3>{item.show.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Not started yet</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            <div className={styles.cards}>
              {data.notStarted.map((show) => (
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
              <h1>Up to date</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            <div className={styles.cards}>
              {data.upToDate.map((item) => (
                <Link key={item.show.id} to={`/tvshow/${item.show.id}`}>
                  <div className={styles.card}>
                    <img src={`${item.show.poster}`} alt={item.show.name} />
                    <h3>{item.show.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.text}>
              <h1>Finished</h1>
              <h3>
                <a href="#">See all..</a>
              </h3>
            </div>

            <div className={styles.cards}>
              {data.finished.map((item) => (
                <Link key={item.show.id} to={`/tvshow/${item.show.id}`}>
                  <div className={styles.card}>
                    <img src={`${item.show.poster}`} alt={item.show.name} />
                    <h3>{item.show.name}</h3>
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
