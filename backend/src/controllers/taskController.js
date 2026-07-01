const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// Allow access only if the requester owns the task or is an admin.
function ensureOwnerOrAdmin(task, user) {
  const isOwner = task.createdBy.toString() === user._id.toString();
  if (!isOwner && user.role !== "admin") {
    throw new ApiError(403, "Access denied. You do not own this task");
  }
}

// POST /api/v1/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});

// GET /api/v1/tasks  (admin sees all, user sees own; optional status/priority filters)
const getTasks = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.user.role !== "admin") {
    filter.createdBy = req.user._id;
  }
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  const tasks = await Task.find(filter)
    .populate("createdBy", "name email role")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// GET /api/v1/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "createdBy",
    "name email role"
  );

  if (!task) throw new ApiError(404, "Task not found");
  ensureOwnerOrAdmin(task, req.user);

  res.status(200).json({ success: true, task });
});

// PUT /api/v1/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) throw new ApiError(404, "Task not found");
  ensureOwnerOrAdmin(task, req.user);

  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  const updatedTask = await task.save();

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    task: updatedTask,
  });
});

// DELETE /api/v1/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) throw new ApiError(404, "Task not found");
  ensureOwnerOrAdmin(task, req.user);

  await task.deleteOne();

  res.status(200).json({ success: true, message: "Task deleted successfully" });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
