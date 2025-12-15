import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import { addEpisode } from "../../services/adminSeasonsEpisodesStore";

export default function AdminAddEpisode() {
  const navigate = useNavigate();

  const adminId = localStorage.getItem("id");
  if (!adminId) {
    navigate("/login");
  }

  const showId = useMemo(
    () => Number(localStorage.getItem("addShowId") || "0"),
    []
  );
  const seasonId = useMemo(
    () => Number(localStorage.getItem("addSeasonId") || "0"),
    []
  );

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!showId || !seasonId) {
      await Swal.fire({
        icon: "error",
        title: "Missing context",
        text: "showId / seasonId not found in localStorage (addShowId, addSeasonId).",
      });
      return;
    }

    if (!name.trim()) {
      await Swal.fire({
        icon: "error",
        title: "Validation",
        text: "Name is required.",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        tvShowId: showId,
        seasonId: seasonId,
        name: name.trim(),
      };

      const response = await fetch("http://localhost:8080/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.message || "Add failed");
      }

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The episode has been successfully created!",
        confirmButtonText: "Ok",
      });

      setName("");
      navigate(`/admin/episodes/${showId}/${seasonId}`);
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Add failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.formInput}>
            <div className={styles.info}>
              <div className={styles.labelInput}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "SAVING..." : "SUBMIT"}
          </button>
        </form>
      </main>
    </div>
  );
}
