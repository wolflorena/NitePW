import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminTvShows.module.css";
import {
  deleteSeasonById,
  listSeasons,
  type AdminSeason,
} from "../../services/adminSeasonsEpisodesStore";

export default function AdminSeasons() {
  const navigate = useNavigate();
  const { showId: showIdParam } = useParams();
  const showId = Number(showIdParam || "0");

  const [seasons, setSeasons] = useState<AdminSeason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    if (!adminId) {
      navigate("/login", { replace: true });
      return;
    }
    if (!showId) {
      navigate("/admin/tvshows", { replace: true });
    }
  }, [navigate, showId]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const data = await listSeasons(showId);
        if (alive) setSeasons(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [showId]);

  const onAddSeason = () => {
    localStorage.setItem("addShowId", String(showId));
    navigate("/admin/add-season");
  };

  const onEditSeason = (s: AdminSeason) => {
    localStorage.setItem("seasonId", String(s.id));
    localStorage.setItem("showId", String(s.tvShowId));
    localStorage.setItem("name", s.name);
    localStorage.setItem("numberEpisodes", String(s.numberOfEpisodes));
    localStorage.setItem("durationEpisodes", String(s.durationEpisode));

    navigate("/admin/edit-season");
  };

  const onDeleteSeason = async (seasonId: number) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    await deleteSeasonById(showId, seasonId);
    setSeasons((prev) => prev.filter((x) => x.id !== seasonId));
  };

  const noDataText =
    !loading && seasons.length === 0 ? "There are no seasons!" : "";

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        <div className={styles.noDataWrap}>
          <p id="no-data" className={styles.noData}>
            {noDataText}
          </p>
        </div>

        <div className={styles.add}>
          <button className={styles.addSeason} onClick={onAddSeason}>
            <i className="fa fa-plus" /> Add Season
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Number of episodes</th>
              <th>Duration episodes (minutes)</th>
              <th />
              <th />
            </tr>
          </thead>

          <tbody>
            {seasons.map((s, idx) => (
              <tr key={s.id}>
                <th>{idx + 1}</th>

                <td>
                  <button
                    className={styles.linkButton}
                    onClick={() =>
                      navigate(`/admin/episodes/${showId}/${s.id}`)
                    }
                    title="Open episodes"
                  >
                    {s.name}
                  </button>
                </td>

                <td>{s.numberOfEpisodes}</td>
                <td>{s.durationEpisode}</td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onDeleteSeason(s.id)}
                    aria-label="Delete season"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEditSeason(s)}
                    aria-label="Edit season"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen" />
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
