import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and users together.
        const [statsRes, usersRes] = await Promise.all([
          axiosInstance.get("/admin/stats"),
          axiosInstance.get("/admin/users"),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-center py-10 text-gray-500">Loading admin data...</p>;
  }

  if (error) {
    return (
      <p className="max-w-2xl mx-auto mt-8 bg-red-100 text-red-700 px-4 py-3 rounded">
        {error}
      </p>
    );
  }

  // Reusable stat card.
  const StatCard = ({ label, value, color }) => (
    <div className={`p-4 rounded-lg shadow text-white ${color}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.totalUsers} color="bg-slate-700" />
        <StatCard label="Total Tasks" value={stats.totalTasks} color="bg-blue-600" />
        <StatCard label="Pending" value={stats.tasksByStatus.pending} color="bg-yellow-500" />
        <StatCard
          label="In Progress"
          value={stats.tasksByStatus["in-progress"]}
          color="bg-indigo-500"
        />
        <StatCard label="Completed" value={stats.tasksByStatus.completed} color="bg-green-600" />
      </div>

      {/* Users table */}
      <h3 className="text-lg font-semibold mb-3">All Users ({users.length})</h3>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2">{u.createdAt?.substring(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
