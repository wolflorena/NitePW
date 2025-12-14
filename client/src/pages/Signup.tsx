import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { mockCreateUser, type Gender } from "../services/mockUsers";
import { confirmAlert, errorAlert, successAlert } from "../services/alert";

const BG_IMAGES = [
  "/img/ahs.jpg",
  "/img/ahs.jpg",
  "/img/wednesday.jpg",
  "/img/witcher.jpg",
  "/img/vikings.jpg",
  "/img/marvel.jpg",
  "/img/you.jpg",
  "/img/girlBefore.jpg",
  "/img/kaleidoscope.jpg",
] as const;

type FormState = {
  username: string;
  gender: "" | Gender;
  birthdate: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function Signup() {
  const navigate = useNavigate();

  const randomBg = useMemo(() => {
    const idx = Math.floor(Math.random() * BG_IMAGES.length);
    return BG_IMAGES[idx];
  }, []);

  const [form, setForm] = useState<FormState>({
    username: "",
    gender: "",
    birthdate: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [loading, setLoading] = useState(false);

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const messages: string[] = [];

    if (!form.username.trim()) messages.push("Username required");
    if (!form.email.trim()) messages.push("Email required");

    if (!form.password) {
      messages.push("Password required");
    } else {
      if (form.password.length < 8) {
        messages.push("Password must have at least 8 characters and 1 digit.");
      }
      if (!form.passwordConfirm) {
        messages.push("You need to confirm your password.");
      }
      if (form.password !== form.passwordConfirm) {
        messages.push("Your password doesn't match.");
      }
    }

    return messages;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const messages = validate();
    if (messages.length > 0) {
      errorAlert(messages.join("\n"));
      return;
    }

    const result = await confirmAlert(
      "Do you want to complete the registration?"
    );

    if (!result.isConfirmed) return;

    setLoading(true);

    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        gender: (form.gender || "Other") as Gender,
        birthdate: form.birthdate || "2000-01-01",
        isAdmin: false,
      };
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const res = await response
        .json()
        .catch(() => ({ message: "Unexpected server response" }));

      await successAlert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      errorAlert("An error occurred during signup. Please try again.");
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
              value={form.username}
              onChange={(e) => setField("username", e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) =>
                setField("gender", e.target.value as FormState["gender"])
              }
            >
              <option value="">Select an option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="birthdate">Birthdate</label>
            <input
              id="birthdate"
              type="date"
              value={form.birthdate}
              onChange={(e) => setField("birthdate", e.target.value)}
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="passwordConfirm">Confirm your password</label>
            <input
              id="passwordConfirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => setField("passwordConfirm", e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "CREATING..." : "SIGNUP"}
          </button>
        </form>

        <h5>
          Already have an account? <Link to="/login">Login here!</Link>
        </h5>
      </div>
    </div>
  );
}
