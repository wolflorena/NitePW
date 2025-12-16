import { useMemo, useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./Profile.module.css";

import { mockUsers } from "../services/mockUsers";
import { mockShows } from "../services/mockShows";
import { seasonMeta } from "../services/mockSeasonMeta";
import { watched } from "../services/mockWatched";

function convertMinutesToFormat(minutes: number) {
  const minutesPerHour = 60;
  const hoursPerDay = 24;
  const minutesPerDay = minutesPerHour * hoursPerDay;
  const minutesPerMonth = minutesPerDay * 30;

  const totalMonths = Math.floor(minutes / minutesPerMonth);
  const totalDays = Math.floor((minutes % minutesPerMonth) / minutesPerDay);
  const totalHours = Math.floor((minutes % minutesPerDay) / minutesPerHour);

  const pad2 = (n: number) => String(n).padStart(2, "0");
  return `${pad2(totalMonths)} ${pad2(totalDays)} ${pad2(totalHours)}`;
}

export default function Profile() {
  const userId = Number(localStorage.getItem("idUser") || "0");
  const username = localStorage.getItem("username") || "";
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    })();
  }, [userId, token]);
  console.log("User data:", user);

  const stats = useMemo(() => {
    const watchedForUser = watched.filter((w) => w.userId === userId);

    let totalTime = 0;
    let totalEpisodes = 0;

    for (const w of watchedForUser) {
      const meta = seasonMeta.find(
        (m) => m.tvShowId === w.tvShowId && m.seasonId === w.seasonId
      );
      if (meta) totalTime += meta.durationEpisode;
      totalEpisodes++;
    }

    const uniqueShowIds = Array.from(
      new Set(watchedForUser.map((x) => x.tvShowId))
    );

    let countWatching = 0;
    let countFinished = 0;

    for (const showId of uniqueShowIds) {
      const show = mockShows.find((s) => s.id === showId);
      if (!show) continue;

      const total = show.totalEpisodes;
      const watchedCount = watchedForUser.filter(
        (x) => x.tvShowId === showId
      ).length;

      let percent = 0;
      if (total) {
        percent = total > 0 ? (watchedCount * 100) / total : 0;
      }

      if (percent < 100) countWatching++;
      if (percent === 100) countFinished++;
    }

    return {
      totalTimeFormatted: convertMinutesToFormat(totalTime),
      totalEpisodes,
      watchedSeries: countFinished,
      currentlyWatching: countWatching,
    };
  }, [userId]);

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.cards}>
          <div className={styles.top}>
            <div className={styles.card}>
              <h3>Total watch time</h3>
              <h1>{stats.totalTimeFormatted}</h1>
              <h4>mths days hrs</h4>
            </div>

            <div className={styles.card}>
              <h3>Watched series</h3>
              <h1>{stats.watchedSeries}</h1>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.card}>
              <h3>Watched episodes</h3>
              <h1>{stats.totalEpisodes}</h1>
            </div>

            <div className={styles.card}>
              <h3>Currently watching</h3>
              <h1>{stats.currentlyWatching}</h1>
            </div>
          </div>
        </div>

        <aside className={styles.profileInfo}>
          <div className={styles.header}>
            <div className={styles.avatarWrap}>
              <img src="/img/chipdale.png" alt="avatar" />
              <div className={styles.imgEdit}>✎</div>
            </div>
            <h3>{user?.username ?? username}</h3>
          </div>

          <div className={styles.credentials}>
            <div className={styles.credentialName}>
              <h2>Username:</h2>
              <h2>Email:</h2>
              <h2>Gender:</h2>
              <h2>Birthdate:</h2>
            </div>

            <div className={styles.credential}>
              <h1>{user?.username ?? "—"}</h1>
              <h1>{user?.email ?? "—"}</h1>
              <span>
                <span>
                  <h1>{user?.gender ?? "—"}</h1>
                </span>
              </span>
              <span>
                <h1>{user?.birthdate ?? "—"}</h1>
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
