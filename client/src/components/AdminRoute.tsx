import { Navigate } from "react-router-dom";

type Props = { children: React.ReactNode };

export default function AdminRoute({ children }: Props) {
  const adminId = localStorage.getItem("id");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!adminId || !isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
