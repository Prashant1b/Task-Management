import { useState, useEffect } from "react";

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const emptyForm = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  // Pre-fill when an existing task is selected for editing.
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || "",
        description: editingTask.description || "",
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        // Format the date for the <input type="date"> field (YYYY-MM-DD).
        dueDate: editingTask.dueDate ? editingTask.dueDate.substring(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!editingTask) setForm(emptyForm); // reset only after a create
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 rounded-lg shadow space-y-3"
    >
      <h3 className="text-lg font-semibold">
        {editingTask ? "Edit Task" : "Create Task"}
      </h3>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className="w-full border rounded px-3 py-2"
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {editingTask ? "Update" : "Create"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
