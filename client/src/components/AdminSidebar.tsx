import { NavLink, useNavigate } from "react-router-dom";
import styles from "./AdminSidebar.module.css";
import { FaUser, FaClapperboard, FaPlus } from "react-icons/fa6";
import { confirmAlert } from "../services/alert";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    const r = await confirmAlert("Do you want to log out?");
    if (!r.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
    } catch (err) {
      // Optionally handle error (e.g., show a message)
    }

    localStorage.clear();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.active} ${styles.link}` : styles.link;

  return (
    <menu className={styles.verticalMenu}>
      <img src="/img/logo.png" alt="Nite" />

      <div className={styles.links}>
        <NavLink to="/admin/users" className={linkClass}>
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={`${styles.wrapper} ${isActive ? styles.active : ""}`}
            >
              <FaUser /> Users
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/tvshows" className={linkClass}>
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={`${styles.wrapper} ${isActive ? styles.active : ""}`}
            >
              <FaClapperboard /> TV Shows
            </div>
          )}
        </NavLink>

        <NavLink to="/admin/add-tvshow" className={linkClass}>
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={`${styles.wrapper} ${isActive ? styles.active : ""}`}
            >
              <FaPlus /> Add a TV Show
            </div>
          )}
        </NavLink>
      </div>

      <button onClick={logout}>LOG OUT</button>
    </menu>
  );
}
