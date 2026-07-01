const express = require("express");
const { getAllUsers, getStats } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// All admin routes require a valid token AND the admin role.
router.use(protect, authorize("admin"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users (no passwords)
 *       403:
 *         description: Access denied
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform statistics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total users, total tasks, and task status counts
 *       403:
 *         description: Access denied
 */
router.get("/stats", getStats);

module.exports = router;
