import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminTvShows.module.css";
import {
  deleteEpisodeById,
  listEpisodes,
  type AdminEpisode,
} from "../../services/adminSeasonsEpisodesStore";

export default function AdminEpisodes() {
  const navigate = useNavigate();
  const params = useParams();

  const showId = useMemo(() => Number(params.showId || "0"), [params.showId]);
  const seasonId = useMemo(
    () => Number(params.seasonId || "0"),
    [params.seasonId]
  );

  const [episodes, setEpisodes] = useState<AdminEpisode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    if (!adminId) {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const data = await listEpisodes(showId, seasonId);
        if (alive) setEpisodes(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [showId, seasonId]);

  const onAddEpisode = () => {
    localStorage.setItem("addShowId", String(showId));
    localStorage.setItem("addSeasonId", String(seasonId));
    navigate("/admin/add-episode");
  };

  const onEditEpisode = (ep: AdminEpisode) => {
    localStorage.setItem("episodeId", String(ep.id));
    localStorage.setItem("seasonId", String(ep.seasonId));
    localStorage.setItem("showId", String(ep.tvShowId));
    localStorage.setItem("name", ep.name);

    navigate("/admin/edit-episode");
  };

  const onDeleteEpisode = async (ep: AdminEpisode) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    await deleteEpisodeById(ep.id);

    setEpisodes((prev) => prev.filter((x) => x.id !== ep.id));
  };

  const noDataText =
    !loading && (episodes.length === 0 ? "There are no episodes!" : "");

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        <div>
          <p className={styles.noData}>{noDataText}</p>
        </div>

        <div className={styles.add}>
          <button className={styles.addEpisode} onClick={onAddEpisode}>
            <i className="fa fa-plus" /> Add Episode
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th />
              <th />
            </tr>
          </thead>

          <tbody>
            {episodes.map((ep, idx) => (
              <tr key={ep.id}>
                <th>{idx + 1}</th>
                <td>{ep.name}</td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onDeleteEpisode(ep)}
                    aria-label="Delete episode"
                    title="Delete"
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEditEpisode(ep)}
                    aria-label="Edit episode"
                    title="Edit"
                  >
                    <i className="fa-solid fa-pen" />
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
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
