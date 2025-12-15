import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import { updateEpisodeName } from "../../services/adminSeasonsEpisodesStore";

export default function AdminEditEpisode() {
  const navigate = useNavigate();

  const initial = useMemo(() => {
    const adminId = localStorage.getItem("id");
    const showId = localStorage.getItem("showId");
    const seasonId = localStorage.getItem("seasonId");
    const episodeId = localStorage.getItem("episodeId");
    const name = localStorage.getItem("name") ?? "";

    return {
      adminId,
      showId: Number(showId || "0"),
      seasonId: Number(seasonId || "0"),
      episodeId: Number(episodeId || "0"),
      name,
    };
  }, []);

  const [name, setName] = useState(initial.name);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initial.adminId) {
      navigate("/login", { replace: true });
      return;
    }
    if (!initial.showId || !initial.seasonId || !initial.episodeId) {
      navigate("/admin/tvshows", { replace: true });
    }
  }, [initial, navigate]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation",
        text: "Name is required.",
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Once edited, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { name: name.trim() };

      const response = await fetch(
        `http://localhost:8080/episodes/${initial.episodeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Update failed");
      }

      ["episodeId", "seasonId", "showId", "name"].forEach((k) =>
        localStorage.removeItem(k)
      );

      navigate(`/admin/episodes/${initial.showId}/${initial.seasonId}`);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        <form className={styles.form} onSubmit={onSave}>
          <div className={styles.formInput}>
            <div className={styles.info}>
              <div className={styles.labelInput}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "SAVING..." : "SAVE"}
          </button>
        </form>
      </main>
    </div>
  );
}
