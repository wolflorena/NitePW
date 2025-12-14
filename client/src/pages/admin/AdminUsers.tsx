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

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminId = sessionStorage.getItem("id");
    if (!adminId) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await listUsers();
      setUsers(data);
      setLoading(false);
    })();
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

    await deleteUserById(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const onEdit = (u: AdminUser) => {
    sessionStorage.setItem("userId", String(u.id));
    sessionStorage.setItem("username", u.username);
    sessionStorage.setItem("email", u.email);
    sessionStorage.setItem("gender", u.gender);
    sessionStorage.setItem("birthdate", u.birthdate);
    sessionStorage.setItem("admin", String(u.isAdmin));
    sessionStorage.setItem("password", u.password ?? "");

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
