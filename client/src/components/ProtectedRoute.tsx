import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const idUser = sessionStorage.getItem("idUser");
  if (!idUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
