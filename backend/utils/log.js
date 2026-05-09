const Log = require("../models/Log");

const createLog = async (userId, action, message) => {
  try {
    await Log.create({
      userId,
      action,
      message,
    });
  } catch (err) {
    console.log("Log error:", err.message);
  }
};

module.exports = { createLog };