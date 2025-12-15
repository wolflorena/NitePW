import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminTvShows.module.css";
import { type AdminSeason } from "../../services/adminSeasonsEpisodesStore";
import { FaPen, FaTrash } from "react-icons/fa6";

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

    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/seasons/by-tvshow/${showId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load seasons");
        }

        if (alive) setSeasons(data);
      } catch (err) {
        console.error(err);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load seasons",
        });
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchSeasons();

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

    try {
      const token = localStorage.getItem("token"); // if protected

      const response = await fetch(
        `http://localhost:8080/seasons/${seasonId}`,
        {
          method: "DELETE",
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ message: "Delete failed" }));
        throw new Error(data.message);
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Season deleted successfully",
      });

      setSeasons((prev) => prev.filter((x) => x.id !== seasonId));
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    }
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
                  <Link to={`/admin/episodes/${showId}/${s.id}`}>{s.name}</Link>
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
                    <FaTrash />
                  </button>
                </td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEditSeason(s)}
                    aria-label="Edit season"
                    title="Edit"
                  >
                    <FaPen />
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
