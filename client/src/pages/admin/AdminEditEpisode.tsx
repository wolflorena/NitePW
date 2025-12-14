import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import { updateEpisodeName } from "../../services/adminSeasonsEpisodesStore";

export default function AdminEditEpisode() {
  const navigate = useNavigate();

  const initial = useMemo(() => {
    const adminId = sessionStorage.getItem("id");
    const showId = sessionStorage.getItem("showId");
    const seasonId = sessionStorage.getItem("seasonId");
    const episodeId = sessionStorage.getItem("episodeId");
    const name = sessionStorage.getItem("name") ?? "";

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
      await updateEpisodeName(initial.episodeId, name.trim());

      ["episodeId", "seasonId", "showId", "name"].forEach((k) =>
        sessionStorage.removeItem(k)
      );

      navigate(`/admin/episodes/${initial.showId}/${initial.seasonId}`);
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
