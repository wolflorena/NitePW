import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import {
  createTvShow,
  type AdminTvShowStatus,
} from "../../services/adminTvShowsStore";

async function fileToDataUrl(file: File | null) {
  if (!file) return "";
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminAddTvShow() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [audience, setAudience] = useState("");
  const [seasons, setSeasons] = useState<number | "">("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState<AdminTvShowStatus | "">("");
  const [streaming, setStreaming] = useState("");
  const [likes, setLikes] = useState<number | "">("");
  const [newSeason, setNewSeason] = useState("");
  const [description, setDescription] = useState("");

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors: string[] = [];
    if (!name.trim()) errors.push("Name is required.");
    if (year === "" || year <= 0) errors.push("Year is required.");
    if (!audience.trim()) errors.push("Audience is required.");
    if (seasons === "" || seasons < 0) errors.push("Seasons is required.");
    if (!genre.trim()) errors.push("Genre is required.");
    if (!status) errors.push("Status is required.");
    if (!streaming) errors.push("Streaming is required.");
    if (likes === "" || likes < 0) errors.push("Likes is required.");
    if (!description.trim()) errors.push("Description is required.");
    return errors;
  };

  const onSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const poster = await fileToDataUrl(posterFile);
      const banner = await fileToDataUrl(bannerFile);
      const logo = await fileToDataUrl(logoFile);

      await createTvShow({
        name: name.trim(),
        year: Number(year),
        audience: audience.trim(),
        seasons: Number(seasons),
        genre: genre.trim(),
        status: status as AdminTvShowStatus,
        description: description.trim(),
        streaming,
        likes: Number(likes),
        newSeason: newSeason.trim(),
        poster,
        banner,
        logo,
      });

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "The tv show has been successfully created!",
        confirmButtonText: "Ok",
      });

      navigate("/admin/tvshows");
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
                <label htmlFor="name">Name of the TV Show</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="year">Release year</label>
                <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value === "" ? "" : Number(e.target.value))
                  }
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="audience">Audience</label>
                <input
                  id="audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="seasons">Number of seasons</label>
                <input
                  id="seasons"
                  type="number"
                  value={seasons}
                  onChange={(e) =>
                    setSeasons(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as AdminTvShowStatus | "")
                  }
                >
                  <option value="">Please choose an option</option>
                  <option value="Ended">Ended</option>
                  <option value="Canceled">Cancelled</option>
                  <option value="On going">On going</option>
                </select>
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="streaming">Streaming</label>
                <select
                  id="streaming"
                  value={streaming}
                  onChange={(e) => setStreaming(e.target.value)}
                >
                  <option value="">Please choose an option</option>
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
                  value={likes}
                  onChange={(e) =>
                    setLikes(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="newseason">New Season</label>
                <input
                  id="newseason"
                  value={newSeason}
                  onChange={(e) => setNewSeason(e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="description">A short description</label>
                <textarea
                  id="description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="poster">Poster</label>
                <input
                  id="poster"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="banner">Banner</label>
                <input
                  id="banner"
                  type="file"
                  onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)}
                />
              </div>

              <div className={styles.labelInput}>
                <label htmlFor="logo">Logo</label>
                <input
                  id="logo"
                  type="file"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
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
