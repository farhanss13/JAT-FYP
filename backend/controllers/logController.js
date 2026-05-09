const Log = require("../models/Log");

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
};

exports.clearLogs = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "All logs cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear logs" });
  }
};