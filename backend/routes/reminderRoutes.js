const express = require("express");
const router = express.Router();

const {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  markAsRead
} = require("../controllers/reminderController");

const { protect: auth } = require("../middleware/authMiddleware");

router.post("/", auth, addReminder);

router.get("/", auth, getReminders);

router.put("/:id", auth, updateReminder);

router.put("/read/:id", auth, markAsRead);

router.delete("/:id", auth, deleteReminder);

module.exports = router;