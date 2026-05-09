const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  jobApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobApplication",
  },
  documentType: {
    type: String,
    enum: ["resume", "coverLetter", "other"],
  },
  filePath: String,
  publicId: String,
  originalName: String,
  storageProvider: {
    type: String,
    default: "cloudinary",
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
