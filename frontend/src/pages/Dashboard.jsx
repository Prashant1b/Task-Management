import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // Show a temporary success/error banner.
  const flash = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchTasks = async () => {
    try {
      const { data } = await axiosInstance.get("/tasks");
      setTasks(data.tasks);
    } catch (err) {
      flash("error", err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle both create and update from the same form.
  const handleSubmit = async (form) => {
    try {
      if (editingTask) {
        await axiosInstance.put(`/tasks/${editingTask._id}`, form);
        flash("success", "Task updated");
        setEditingTask(null);
      } else {
        await axiosInstance.post("/tasks", form);
        flash("success", "Task created");
      }
      fetchTasks();
    } catch (err) {
      flash("error", err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axiosInstance.delete(`/tasks/${id}`);
      flash("success", "Task deleted");
      fetchTasks();
    } catch (err) {
      flash("error", err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-1">
        Welcome, {user?.name} 👋
      </h2>
      <p className="text-gray-500 mb-6">Manage your tasks below.</p>

      {message && (
        <p
          className={`mb-4 px-3 py-2 rounded text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <TaskForm
            onSubmit={handleSubmit}
            editingTask={editingTask}
            onCancel={() => setEditingTask(null)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Your Tasks ({tasks.length})
          </h3>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDelete}
              showOwner={user?.role === "admin"}
            />
          )}
        </div>
      </div>
    </div>
  );
}
