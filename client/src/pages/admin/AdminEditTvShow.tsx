import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import {
  updateTvShow,
  type AdminTvShowStatus,
} from "../../services/adminTvShowsStore";

type FormState = {
  id: number;
  name: string;
  year: string;
  audience: string;
  seasons: string;
  genre: string;
  status: AdminTvShowStatus | "Cancelled";
  streaming: string;
  likes: string;
  newSeason: string;
  description: string;
};

function mapStatusFromStorage(v: string | null): FormState["status"] {
  if (!v) return "On going";
  if (v === "Cancelled") return "Cancelled";
  if (v === "Canceled") return "Canceled";
  if (v === "Ended") return "Ended";
  if (v === "On going") return "On going";
  return "On going";
}

function mapStatusToStore(v: FormState["status"]): AdminTvShowStatus {
  return v === "Cancelled" ? "Canceled" : (v as AdminTvShowStatus);
}

export default function AdminEditTvShow() {
  const navigate = useNavigate();

  const initial = useMemo<FormState | null>(() => {
    const idStr = sessionStorage.getItem("showId");
    const id = Number(idStr || "0");
    if (!id) return null;

    return {
      id,
      name: sessionStorage.getItem("name") ?? "",
      year: sessionStorage.getItem("year") ?? "",
      audience: sessionStorage.getItem("audience") ?? "",
      seasons: sessionStorage.getItem("seasons") ?? "",
      genre: sessionStorage.getItem("genre") ?? "",
      status: mapStatusFromStorage(sessionStorage.getItem("status")),
      description: sessionStorage.getItem("description") ?? "",
      streaming: sessionStorage.getItem("streaming") ?? "Netflix",
      likes: sessionStorage.getItem("likes") ?? "0",
      newSeason: sessionStorage.getItem("newseason") ?? "",
    };
  }, []);

  const [form, setForm] = useState<FormState | null>(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminId = sessionStorage.getItem("id");
    if (!adminId) navigate("/login");

    if (!initial) navigate("/admin/tvshows");
  }, [navigate, initial]);

  if (!form) return null;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const validate = () => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push("Name is required.");
    if (!form.year.trim()) errs.push("Year is required.");
    if (!form.audience.trim()) errs.push("Audience is required.");
    if (!form.seasons.trim()) errs.push("Seasons is required.");
    if (!form.genre.trim()) errs.push("Genre is required.");
    if (!form.streaming.trim()) errs.push("Streaming is required.");
    if (!form.description.trim()) errs.push("Description is required.");
    return errs;
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (errs.length) {
      await Swal.fire({
        icon: "error",
        title: "Validation",
        text: errs.join("\n"),
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
      await updateTvShow(form.id, {
        name: form.name.trim(),
        year: Number(form.year),
        audience: form.audience.trim(),
        seasons: Number(form.seasons),
        genre: form.genre.trim(),
        status: mapStatusToStore(form.status),
        description: form.description.trim(),
        streaming: form.streaming,
        likes: Number(form.likes || "0"),
        newSeason: form.newSeason.trim(),
      });

      [
        "showId",
        "name",
        "year",
        "audience",
        "seasons",
        "genre",
        "status",
        "description",
        "streaming",
        "likes",
        "newseason",
      ].forEach((k) => sessionStorage.removeItem(k));

      navigate("/admin/tvshows");
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
                <label htmlFor="name">Name of the TV Show</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="year">Release year</label>
                <input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="audience">Audience</label>
                <input
                  id="audience"
                  value={form.audience}
                  onChange={(e) => set("audience", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="seasons">Number of seasons</label>
                <input
                  id="seasons"
                  type="number"
                  value={form.seasons}
                  onChange={(e) => set("seasons", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  value={form.genre}
                  onChange={(e) => set("genre", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    set("status", e.target.value as FormState["status"])
                  }
                >
                  <option value="Ended">Ended</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="On going">On going</option>
                </select>
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="streaming">Streaming</label>
                <select
                  id="streaming"
                  value={form.streaming}
                  onChange={(e) => set("streaming", e.target.value)}
                >
                  <option value="Netflix">Netflix</option>
                  <option value="HBO">HBO</option>
                  <option value="Disney+">Disney+</option>
                  <option value="AmazonPrime">Amazon Prime</option>
                </select>
              </div>
            </div>

            <div className={styles.images}>
              <div className={styles.labelInput}>
                <label htmlFor="likes">Likes</label>
                <input
                  id="likes"
                  type="number"
                  value={form.likes}
                  onChange={(e) => set("likes", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="newseason">New Season</label>
                <input
                  id="newseason"
                  value={form.newSeason}
                  onChange={(e) => set("newSeason", e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="description">A short description</label>
                <textarea
                  id="description"
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
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
