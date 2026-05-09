const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    positionTitle: {
      type: String,
      required: true,
    },

    company: {  
      type: String,
      default: "",
    },

    jobLink: String,

    dateApplied: {
      type: Date,
      default: Date.now,
    },

    contact: String,

    status: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);