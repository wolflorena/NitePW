import { NavLink, useNavigate, type NavLinkProps } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { confirmAlert } from "../services/alert";

import { FaHouse, FaClock, FaList, FaHeart, FaUser } from "react-icons/fa6";

export default function Sidebar() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username") || "";

  const logout = async () => {
    const r = await confirmAlert("Do you want to log out?");
    if (!r.isConfirmed) return;
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <menu className={styles.verticalMenu}>
      <img src="/img/logo.png" alt="" />
      <div className={styles.welcomeMessage}>
        <h1 id="welcome-message">
          Hello,<span> {username}</span>
        </h1>
      </div>

      <div className={styles.links}>
        <NavLink to="/app">
          {({ isActive }: { isActive: boolean }) => (
            <div
              className={`${styles.wrapper} ${isActive ? styles.active : ""}`}
            >
              <FaHouse /> Home
            </div>
          )}
        </NavLink>

        <NavLink to="/upcoming">
          <FaClock /> Upcoming
        </NavLink>

        <NavLink to="/watchlist">
          <FaList /> Watchlist
        </NavLink>

        <NavLink to="/favorites">
          <FaHeart /> Favorites
        </NavLink>

        <NavLink to="/profile">
          <FaUser /> Profile
        </NavLink>
      </div>

      <button type="button" onClick={logout}>
        LOG OUT
      </button>
    </menu>
  );
}
