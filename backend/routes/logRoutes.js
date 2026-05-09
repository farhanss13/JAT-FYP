const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getLogs, clearLogs } = require("../controllers/logController");

router.get("/", protect, getLogs);

router.delete("/", protect, clearLogs);

module.exports = router;