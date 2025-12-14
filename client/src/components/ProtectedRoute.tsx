import { Navigate } from "react-router-dom";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const idUser = localStorage.getItem("idUser");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!idUser || isAdmin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
