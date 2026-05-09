const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobApplicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobApplication",
      required: true,
    },
    reminderDate: {
      type: Date,
      required: true,
    },
    reminderType: {
      type: String,
      enum: ["Follow-up", "Interview", "Deadline", "Other"],
      default: "Follow-up",
    },
    isRead: {
  type: Boolean,
  default: false,
},
    status: {
  type: String,
  enum: ["Pending", "Triggered"],
  default: "Pending",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reminder", reminderSchema);