import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { mockLogin } from "../services/mockAuth";
import { errorAlert, successAlert } from "../services/alert";

const BG_IMAGES = [
  "/img/ahs.jpg",
  "/img/breakingBad.jpg",
  "/img/wednesday.jpg",
  "/img/witcher.jpg",
  "/img/vikings.jpg",
  "/img/marvel.jpg",
  "/img/you.jpg",
  "/img/girlBefore.jpg",
  "/img/kaleidoscope.jpg",
] as const;

export default function Login() {
  const navigate = useNavigate();

  const randomBg = useMemo(() => {
    const idx = Math.floor(Math.random() * BG_IMAGES.length);
    return BG_IMAGES[idx];
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const messages: string[] = [];
    if (!username.trim()) messages.push("Username is required!");
    if (!password) messages.push("Password is required!");
    return messages;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const messages = validate();
    if (messages.length > 0) {
      errorAlert(messages.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const res = await mockLogin(username.trim(), password);

      if (!res.ok) {
        errorAlert(res.message);
        return;
      }

      await successAlert("Login successful!");

      if (res.isAdmin) {
        sessionStorage.setItem("id", String(res.id));
        navigate("/admin");
      } else {
        sessionStorage.setItem("idUser", String(res.id));
        sessionStorage.setItem("username", res.username);
        navigate("/app");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.page}
      style={{ backgroundImage: `url(${randomBg})` }}
    >
      <div className={styles.formParent}>
        <img src="/img/logo.png" alt="Nite" />

        <form className={styles.form} onSubmit={onSubmit}>
          <div className={styles.labelInput}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(ev) => setUsername(ev.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <h5>
          Don&apos;t have an account? <Link to="/signup">Signup here!</Link>
        </h5>
      </div>
    </div>
  );
}
