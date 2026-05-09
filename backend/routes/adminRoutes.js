const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/adminController");



const { protect } = require("../middleware/authMiddleware");
const {
  getUsers,
  deleteUser,
  getAdminStats,
  getAllJobs,
  getUserJobs,
  deleteJobAdmin
} = require("../controllers/adminController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

router.get("/users", protect, adminOnly, getUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/jobs", protect, adminOnly, getAllJobs);
router.get("/users/:id/jobs", protect, adminOnly, getUserJobs);
router.delete("/jobs/:id", protect, adminOnly, deleteJobAdmin);
router.get("/settings", protect, adminOnly, getSettings);
router.put("/settings", protect, adminOnly, updateSettings);


module.exports = router;