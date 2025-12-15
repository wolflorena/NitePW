import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./TvShow.module.css";

import {
  episodesBySeasonId,
  seasonsByShowId,
  tvShowDetailsById,
} from "../services/mockTvShowDetails";

import {
  getWatchedEpisodeIds,
  isAdded,
  isFavorite,
  toggleAdded,
  toggleEpisodeWatched,
  toggleFavorite,
} from "../services/mockUserLists";

export default function TvShow() {
  const { id } = useParams();
  const showId = Number(id);
  const userId = Number(localStorage.getItem("idUser") || "0");

  const details = tvShowDetailsById[showId];

  const seasons = seasonsByShowId[showId] ?? [];
  const defaultSeasonId = seasons[0]?.id;

  const [seasonId, setSeasonId] = useState<number | undefined>(defaultSeasonId);

  const [watchedSet, setWatchedSet] = useState<Set<number>>(
    () => new Set(getWatchedEpisodeIds(userId))
  );

  const [fav, setFav] = useState(() => isFavorite(userId, showId));
  const [added, setAdded] = useState(() => isAdded(userId, showId));

  useEffect(() => {
    setFav(isFavorite(userId, showId));
    setAdded(isAdded(userId, showId));
    setWatchedSet(new Set(getWatchedEpisodeIds(userId)));
  }, [userId, showId]);

  useEffect(() => {
    if (!seasonId && defaultSeasonId) setSeasonId(defaultSeasonId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSeasonId]);

  const episodes = useMemo(() => {
    if (!seasonId) return [];
    return episodesBySeasonId[seasonId] ?? [];
  }, [seasonId]);

  const listRef = useRef<HTMLOListElement | null>(null);

  const scrollBy = (delta: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollTop + delta, behavior: "smooth" });
  };

  const onToggleFav = () => setFav(toggleFavorite(userId, showId));
  const onToggleAdded = () => setAdded(toggleAdded(userId, showId));

  const onToggleEpisode = (episodeId: number) => {
    toggleEpisodeWatched(userId, episodeId);
    setWatchedSet(new Set(getWatchedEpisodeIds(userId)));
  };

  if (!details) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p className={styles.notFound}>Show not found (mock).</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Sidebar />

      <main
        className={styles.main}
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(/img/${details.banner})`,
        }}
      >
        <div className={styles.info}>
          <img
            src={`${details.logo}`}
            alt={details.id.toString()}
            className={styles.title}
          />

          <div className={styles.firstChild}>
            <ul className={styles.general}>
              <li>{details.year}</li>
              <li>{details.audience}</li>
              <li>{details.seasons} Seasons</li>
              <li>{details.status}</li>
            </ul>

            <img
              src={`${details.streaming}.png`}
              alt={details.streaming}
              className={styles.streaming}
            />

            <button
              className={styles.heartBtn}
              onClick={onToggleFav}
              type="button"
            >
              <span className={fav ? styles.heartSolid : styles.heartRegular}>
                ♥
              </span>
            </button>

            <button
              className={styles.plusBtn}
              onClick={onToggleAdded}
              type="button"
            >
              <span className={styles.plusIcon}>{added ? "✓" : "+"}</span>
            </button>
          </div>

          <div className={styles.description}>
            <p>{details.description}</p>
          </div>
        </div>

        <div className={styles.episodesList}>
          <div className={styles.episodes}>
            <div className={styles.header}>
              <h3>Episodes</h3>

              <select
                value={seasonId}
                onChange={(e) => setSeasonId(Number(e.target.value))}
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <ol className={styles.listOfEpisodes} ref={listRef}>
              {episodes.map((ep) => {
                const watched = watchedSet.has(ep.id);
                return (
                  <div className={styles.episode} key={ep.id}>
                    <li>{ep.name}</li>
                    <button
                      className={styles.check}
                      type="button"
                      onClick={() => onToggleEpisode(ep.id)}
                      aria-label={watched ? "Mark as unseen" : "Mark as seen"}
                    >
                      <span
                        className={watched ? styles.checkOn : styles.checkOff}
                      >
                        ✔
                      </span>
                    </button>
                  </div>
                );
              })}
            </ol>
          </div>

          <div className={styles.carouselButtons}>
            <button
              type="button"
              className={styles.sliderButton}
              onClick={() => scrollBy(-350)}
            >
              ˄
            </button>
            <button
              type="button"
              className={styles.sliderButton}
              onClick={() => scrollBy(350)}
            >
              ˅
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
