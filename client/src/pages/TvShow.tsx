import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import styles from "./TvShow.module.css";

type Season = { id: number; name: string };
type Episode = { id: number; name: string };
type TvShowDetails = {
  id: number;
  year: number;
  audience: string;
  seasons: number;
  status: string;
  description: string;
  streaming: string;
  banner: string;
  logo: string;
};

const API = "http://localhost:8080";

export default function TvShow() {
  const { id } = useParams();
  const showId = Number(id);
  const userId = Number(localStorage.getItem("idUser") || "0");
  const token = localStorage.getItem("token"); // if you protect endpoints

  const [details, setDetails] = useState<TvShowDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonId, setSeasonId] = useState<number | undefined>(undefined);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchedSet, setWatchedSet] = useState<Set<number>>(new Set());
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLOListElement | null>(null);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const scrollBy = (delta: number) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollTop + delta, behavior: "smooth" });
  };

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!showId) return;

      setLoading(true);
      try {
        const detailsRes = await fetch(`${API}/tvshows/${showId}`, { headers });
        const detailsData = await detailsRes.json().catch(() => null);
        if (!detailsRes.ok)
          throw new Error(
            detailsData?.message || "Failed to load show details"
          );

        const seasonsRes = await fetch(`${API}/seasons/by-tvshow/${showId}`, {
          headers,
        });
        const seasonsData = await seasonsRes.json().catch(() => []);
        if (!seasonsRes.ok)
          throw new Error(seasonsData?.message || "Failed to load seasons");

        const favRes = await fetch(
          `${API}/users/${userId}/favorites/${showId}`,
          { headers }
        );
        const favData = await favRes
          .json()
          .catch(() => ({ isFavorite: false }));

        const addedRes = await fetch(`${API}/users/${userId}/added/${showId}`, {
          headers,
        });
        const addedData = await addedRes
          .json()
          .catch(() => ({ isAdded: false }));

        const watchedRes = await fetch(
          `${API}/users/${userId}/watched-episodes`,
          { headers }
        );
        const watchedData = await watchedRes.json().catch(() => []);

        console.log("Watched data:", watchedData);
        if (!alive) return;

        setDetails(detailsData);
        setSeasons(seasonsData);

        const firstSeasonId = seasonsData?.[0]?.id;
        setSeasonId((prev) => prev ?? firstSeasonId);

        setFav(Boolean(favData?.isFavorite));
        setAdded(Boolean(addedData?.isAdded));
        const watchedIds = (watchedData as any[]).map((x) => x.episodeId);
        setWatchedSet(new Set(watchedIds));
      } catch (e) {
        console.error(e);
        if (alive) {
          setDetails(null);
          setSeasons([]);
          setEpisodes([]);
          setSeasonId(undefined);
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [showId, userId]);

  useEffect(() => {
    let alive = true;

    const loadEpisodes = async () => {
      if (!seasonId) {
        setEpisodes([]);
        return;
      }

      try {
        const res = await fetch(`${API}/episodes/by-season/${seasonId}`, {
          headers,
        });
        const data = await res.json().catch(() => []);
        if (!res.ok)
          throw new Error(data?.message || "Failed to load episodes");

        if (alive) setEpisodes(data);
      } catch (e) {
        console.error(e);
        if (alive) setEpisodes([]);
      }
    };

    loadEpisodes();

    return () => {
      alive = false;
    };
  }, [seasonId]);

  // Toggle favorite (backend)
  const onToggleFav = async () => {
    try {
      // ✅ typical: POST to add, DELETE to remove
      const next = !fav;

      const res = await fetch(`${API}/users/${userId}/favorites/${showId}`, {
        method: next ? "POST" : "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to toggle favorite");
      }

      setFav(next);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle added (backend)
  const onToggleAdded = async () => {
    try {
      const next = !added;

      const res = await fetch(`${API}/users/${userId}/added/${showId}`, {
        method: next ? "POST" : "DELETE",
        headers,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to toggle added");
      }

      setAdded(next);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle episode watched (backend)
  const onToggleEpisode = async (episodeId: number) => {
    try {
      const watched = watchedSet.has(episodeId);

      const res = await fetch(
        `${API}/watch-progress/${userId}/watched-episodes/${episodeId}`,
        {
          method: watched ? "DELETE" : "POST",
          headers,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to toggle watched");
      }

      // update UI state
      setWatchedSet((prev) => {
        const next = new Set(prev);
        if (watched) next.delete(episodeId);
        else next.add(episodeId);
        return next;
      });

      console.log("Watched set:", watchedSet);
    } catch (e) {
      console.error(e);
    }
  };

  const safeSeasons = useMemo(() => seasons ?? [], [seasons]);

  if (!details && !loading) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p className={styles.notFound}>Show not found.</p>
        </main>
      </div>
    );
  }

  if (!details) {
    return (
      <div className={styles.page}>
        <Sidebar />
        <main className={styles.main}>
          <p className={styles.notFound}>Loading...</p>
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
          // If banner is a DATA URL from backend, use it directly:
          // backgroundImage: `linear-gradient(...), url(${details.banner})`,
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${details.banner})`,
        }}
      >
        <div className={styles.info}>
          <img
            src={details.logo}
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
              src={`/img/${details.streaming}.png`}
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
                {safeSeasons.map((s) => (
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
