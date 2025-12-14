import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
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

  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const messages: string[] = [];
    if (!email.trim()) messages.push("Email is required!");
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
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const res = await response.json();

      await successAlert("Login successful!");

      if (res.token) localStorage.setItem("token", res.token);

      if (res.isAdmin === true) {
        localStorage.removeItem("idUser");
        localStorage.setItem("id", String(res.userId));
        localStorage.setItem("username", res.username);
        localStorage.setItem("isAdmin", "true");
        navigate("/admin/users");
      } else {
        localStorage.removeItem("id");
        localStorage.setItem("idUser", String(res.userId));
        localStorage.setItem("username", res.username);
        navigate("/app");
      }
    } catch (error) {
      console.error("Login error:", error);
      errorAlert("An error occurred during login. Please try again.");
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(ev) => setemail(ev.target.value)}
              autoComplete="email"
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
