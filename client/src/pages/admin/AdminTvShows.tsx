import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPen, FaTrash } from "react-icons/fa6";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminTvShows.module.css";
import {
  deleteTvShowById,
  listTvShows,
  type AdminTvShow,
} from "../../services/adminTvShowsStore";

function computeNewSeasonCell(show: AdminTvShow) {
  let k = "Unknown";
  if (show.newSeason != null && show.newSeason !== "") k = show.newSeason;
  if (show.status !== "On going") k = show.status;
  return k;
}

export default function AdminTvShows() {
  const navigate = useNavigate();
  const [shows, setShows] = useState<AdminTvShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    if (!adminId) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await listTvShows();
      setShows(data);
      setLoading(false);
    })();
  }, []);

  const onDelete = async (showId: number) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    await deleteTvShowById(showId);
    setShows((prev) => prev.filter((s) => s.id !== showId));
  };

  const onEdit = (s: AdminTvShow) => {
    localStorage.setItem("showId", String(s.id));
    localStorage.setItem("name", s.name);
    localStorage.setItem("year", String(s.year));
    localStorage.setItem("audience", s.audience);
    localStorage.setItem("seasons", String(s.seasons));
    localStorage.setItem("genre", s.genre);
    localStorage.setItem("status", s.status);
    localStorage.setItem("description", s.description);
    localStorage.setItem("streaming", s.streaming);
    localStorage.setItem("likes", String(s.likes));
    localStorage.setItem("newseason", String(s.newSeason ?? ""));

    navigate("/admin/edit-tvshow");
  };

  const noData = !loading && shows.length === 0;

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        {noData && <p className={styles.noData}>There are no TV shows!</p>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Year</th>
              <th>Audience</th>
              <th>Seasons</th>
              <th>Genre</th>
              <th>Status</th>
              <th>Description</th>
              <th>Streaming</th>
              <th>Likes</th>
              <th>New Season</th>
              <th />
              <th />
            </tr>
          </thead>

          <tbody>
            {shows.map((s, idx) => (
              <tr key={s.id}>
                <td>{idx + 1}</td>

                <td>
                  <Link to={`/admin/seasons/${s.id}`}>{s.name}</Link>
                </td>

                <td>{s.year}</td>
                <td>{s.audience}</td>
                <td>{s.seasons}</td>
                <td>{s.genre}</td>
                <td>{s.status}</td>

                <td className={styles.descriptionCell}>{s.description}</td>

                <td>{s.streaming}</td>
                <td>{s.likes}</td>

                <td>{computeNewSeasonCell(s)}</td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onDelete(s.id)}
                  >
                    <FaTrash />
                  </button>
                </td>

                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEdit(s)}
                  >
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
