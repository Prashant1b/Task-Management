import { Navigate } from "react-router-dom";

// The JWT lives in an httpOnly cookie (not readable by JS), so we gate
// routes on the cached user object. The server still enforces real auth.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
