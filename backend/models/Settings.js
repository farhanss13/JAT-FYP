const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  defaultJobStatus: {
    type: String,
    default: "Applied",
  },
});

module.exports = mongoose.model("Settings", settingsSchema);