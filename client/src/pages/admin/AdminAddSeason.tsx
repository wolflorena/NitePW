import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import { addSeason } from "../../services/adminSeasonsEpisodesStore";

export default function AdminAddSeason() {
  const navigate = useNavigate();

  const adminId = sessionStorage.getItem("id");
  const showIdRaw = sessionStorage.getItem("addShowId");
  const showId = Number(showIdRaw || "0");

  const [name, setName] = useState("");
  const [numberOfEpisodes, setNumberOfEpisodes] = useState<number>(0);
  const [durationEpisode, setDurationEpisode] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!adminId) {
      navigate("/login", { replace: true });
      return;
    }
    if (!showId) {
      navigate("/admin/tvshows", { replace: true });
    }
  }, [adminId, navigate, showId]);

  const validate = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("Name is required.");
    if (!Number.isFinite(numberOfEpisodes) || numberOfEpisodes <= 0)
      errors.push("Number of episodes must be > 0.");
    if (!Number.isFinite(durationEpisode) || durationEpisode <= 0)
      errors.push("Duration episodes must be > 0.");
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      await addSeason(showId, name.trim(), numberOfEpisodes, durationEpisode);

      await Swal.fire({
        title: "Success!",
        text: "The season has been successfully created!",
        icon: "success",
        confirmButtonText: "Ok",
      });
      sessionStorage.removeItem("addShowId");

      navigate(`/admin/seasons/${showId}`);
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err instanceof Error ? err.message : "Post failed",
        icon: "error",
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
                <label htmlFor="durationEpisode">Duration episodes</label>
                <input
                  id="durationEpisode"
                  type="number"
                  value={durationEpisode || ""}
                  onChange={(e) => setDurationEpisode(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </form>
      </main>
    </div>
  );
}
