import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminAddTvShow.module.css";
import {
  type AdminUserGender,
  updateUser,
} from "../../services/adminUsersStore";

export default function AdminEditUser() {
  const navigate = useNavigate();

  const adminId = localStorage.getItem("id");

  const userId = Number(localStorage.getItem("userId") || "0");
  const initialUsername = localStorage.getItem("username") ?? "";
  const initialEmail = localStorage.getItem("email") ?? "";
  const initialGender = (localStorage.getItem("gender") ??
    "") as AdminUserGender;
  const initialBirthdate = localStorage.getItem("birthdate") ?? "";
  const initialAdmin = localStorage.getItem("admin") ?? "false";
  const password = localStorage.getItem("password") ?? "";

  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [gender, setGender] = useState<AdminUserGender | undefined>(
    initialGender === "Male" ||
      initialGender === "Female" ||
      initialGender === "Other"
      ? initialGender
      : undefined
  );
  const [birthdate, setBirthdate] = useState(initialBirthdate);
  const [isAdmin, setIsAdmin] = useState(initialAdmin === "true");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!adminId) {
      navigate("/login", { replace: true });
      return;
    }
    if (!userId) {
      navigate("/admin/users", { replace: true });
    }
  }, [adminId, navigate, userId]);

  const validate = useMemo(() => {
    const errors: string[] = [];
    if (!username.trim()) errors.push("Username is required.");
    if (!email.trim()) errors.push("Email is required.");
    return errors;
  }, [email, username]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate.length) {
      await Swal.fire({
        icon: "error",
        title: "Validation",
        html: validate.map((x) => `• ${x}`).join("<br/>"),
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
      await updateUser(userId, {
        username: username.trim(),
        email: email.trim(),
        gender,
        birthdate,
        isAdmin,
        password,
      });

      [
        "userId",
        "username",
        "email",
        "gender",
        "birthdate",
        "admin",
        "password",
      ].forEach((k) => localStorage.removeItem(k));

      navigate("/admin/users");
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
          <div className={styles.labelInput}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as AdminUserGender)}
            >
              <option value="">Please choose an option</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="birthdate">Birthdate</label>
            <input
              id="birthdate"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>

          <div className={styles.labelInput}>
            <label htmlFor="admin">Admin</label>
            <select
              id="admin"
              value={String(isAdmin)}
              onChange={(e) => setIsAdmin(e.target.value === "true")}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>

          <button type="submit" id="button" disabled={saving}>
            {saving ? "SAVING..." : "SAVE"}
          </button>
        </form>
      </main>
    </div>
  );
}
