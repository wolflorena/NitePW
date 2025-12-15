import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaPen, FaTrash } from "react-icons/fa6";

import AdminSidebar from "../../components/AdminSidebar";
import styles from "./AdminUsers.module.css";
import {
  deleteUserById,
  listUsers,
  type AdminUser,
} from "../../services/adminUsersStore";
import { errorAlert } from "../../services/alert";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = localStorage.getItem("id");
    if (!adminId) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8080/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const data = await response.json();

        if (!response.ok) {
          errorAlert(data?.message || "Failed to load users");
          return;
        }

        setUsers(data);
      } catch (error) {
        errorAlert("Network/server error while loading users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const onDelete = async (userId: number) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!res.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        const data = await response
          .json()
          .catch(() => ({ message: "Delete failed" }));
        throw new Error(data.message);
      }

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "User deleted successfully",
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: err instanceof Error ? err.message : "Delete failed",
      });
    }
  };

  const onEdit = (u: AdminUser) => {
    localStorage.setItem("userId", String(u.id));
    localStorage.setItem("username", u.username);
    localStorage.setItem("email", u.email);
    localStorage.setItem("gender", u.gender);
    localStorage.setItem("birthdate", u.birthdate);
    localStorage.setItem("admin", String(u.isAdmin));

    navigate("/admin/edit-user");
  };

  const noData = !loading && users.length === 0;

  return (
    <div className={styles.page}>
      <AdminSidebar />

      <main className={styles.main}>
        <div>
          {noData && <p className={styles.noData}>There are no users!</p>}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Birthdate</th>
              <th>IsAdmin</th>
              <th />
              <th />
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id}>
                <td>{idx + 1}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.gender}</td>
                <td>{u.birthdate}</td>
                <td>{String(u.isAdmin)}</td>
                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onDelete(u.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
                <td>
                  <button
                    className={styles.actionBtn}
                    onClick={() => onEdit(u)}
                  >
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
