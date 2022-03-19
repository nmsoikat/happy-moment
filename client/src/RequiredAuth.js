import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function RequiredAuth({ children }) {
  const { user } = useContext(AuthContext)
  const location = useLocation();

  console.log({user});
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children;
}
