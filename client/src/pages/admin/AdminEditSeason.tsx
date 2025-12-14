import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import { updateSeason } from "../../services/adminSeasonsEpisodesStore";

export default function AdminEditSeason() {
  const navigate = useNavigate();

  const adminId = localStorage.getItem("id");

  const showIdRaw = localStorage.getItem("showId");
  const seasonIdRaw = localStorage.getItem("seasonId");
  const nameRaw = localStorage.getItem("name");
  const numberEpisodesRaw = localStorage.getItem("numberEpisodes");
  const durationEpisodesRaw = localStorage.getItem("durationEpisodes");

  const showId = Number(showIdRaw || "0");
  const seasonId = Number(seasonIdRaw || "0");

  const [name, setName] = useState(nameRaw ?? "");
  const [numberOfEpisodes, setNumberOfEpisodes] = useState<number>(
    Number(numberEpisodesRaw || "0")
  );
  const [durationEpisode, setDurationEpisode] = useState<number>(
    Number(durationEpisodesRaw || "0")
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminId) {
      navigate("/login", { replace: true });
      return;
    }
    if (!showId || !seasonId) {
      navigate("/admin/tvshows", { replace: true });
    }
  }, [adminId, navigate, seasonId, showId]);

  const validate = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("Name is required.");
    if (!Number.isFinite(numberOfEpisodes) || numberOfEpisodes <= 0)
      errors.push("Number of episodes must be > 0.");
    if (!Number.isFinite(durationEpisode) || durationEpisode <= 0)
      errors.push("Duration episodes must be > 0.");
    return errors;
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (errors.length) {
      await Swal.fire({
        icon: "error",
        title: "Validation",
        html: errors.map((x) => `• ${x}`).join("<br/>"),
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Once edited, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, save",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    setSaving(true);
    try {
      await updateSeason(seasonId, {
        tvShowId: showId,
        name: name.trim(),
        numberOfEpisodes,
        durationEpisode,
      });

      localStorage.removeItem("seasonId");
      localStorage.removeItem("showId");
      localStorage.removeItem("name");
      localStorage.removeItem("numberEpisodes");
      localStorage.removeItem("durationEpisodes");

      navigate(`/admin/seasons/${showId}`);
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err instanceof Error ? err.message : "Put failed",
        icon: "error",
      });
    } finally {
      setSaving(false);
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

              <div className={styles.labelInput}>
                <label htmlFor="numberEpisodes">Number of episodes</label>
                <input
                  id="numberEpisodes"
                  type="number"
                  value={numberOfEpisodes || ""}
                  onChange={(e) => setNumberOfEpisodes(Number(e.target.value))}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="durationEpisodes">Duration episodes</label>
                <input
                  id="durationEpisodes"
                  type="number"
                  value={durationEpisode || ""}
                  onChange={(e) => setDurationEpisode(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button type="submit" id="button" disabled={saving}>
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </form>
      </main>
    </div>
  );
}
