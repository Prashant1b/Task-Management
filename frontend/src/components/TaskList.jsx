const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
};

export default function TaskList({ tasks, onEdit, onDelete, showOwner = false }) {
  if (!tasks.length) {
    return <p className="text-gray-500 text-center py-6">No tasks yet.</p>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-start"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-lg">{task.title}</h4>
            {task.description && (
              <p className="text-gray-600 text-sm">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <span className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}>
                {task.status}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              {task.dueDate && (
                <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700">
                  Due: {task.dueDate.substring(0, 10)}
                </span>
              )}
            </div>

            {showOwner && task.createdBy && (
              <p className="text-xs text-gray-400 pt-1">
                Owner: {task.createdBy.name} ({task.createdBy.email})
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
