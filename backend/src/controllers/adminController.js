const User = require("../models/User");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/v1/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: users.length, users });
});

// GET /api/v1/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalTasks, pending, inProgress, completed] =
    await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Task.countDocuments({ status: "pending" }),
      Task.countDocuments({ status: "in-progress" }),
      Task.countDocuments({ status: "completed" }),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalTasks,
      tasksByStatus: {
        pending,
        "in-progress": inProgress,
        completed,
      },
    },
  });
});

module.exports = { getAllUsers, getStats };
