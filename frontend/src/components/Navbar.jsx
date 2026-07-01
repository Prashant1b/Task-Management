import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = async () => {
    try {
      // Clears the httpOnly cookie on the server.
      await axiosInstance.post("/auth/logout");
    } catch {
      // Ignore errors; we log out locally regardless.
    }
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">
        TaskManager
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-slate-300">
              Dashboard
            </Link>

            {user.role === "admin" && (
              <Link to="/admin" className="hover:text-slate-300">
                Admin
              </Link>
            )}

            <span className="text-sm text-slate-300">
              {user.name} ({user.role})
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-slate-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-slate-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
