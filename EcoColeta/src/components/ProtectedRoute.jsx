import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, perfil }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfil && usuario.perfil !== perfil) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
