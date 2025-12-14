import { NavLink, useNavigate } from "react-router-dom";
import styles from "./AdminSidebar.module.css";
import { FaUser, FaClapperboard, FaPlus } from "react-icons/fa6";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
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
          <FaPlus /> Add a TV Show
        </NavLink>
      </div>

      <button onClick={logout}>LOG OUT</button>
    </menu>
  );
}
