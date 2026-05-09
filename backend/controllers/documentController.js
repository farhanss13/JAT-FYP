const Document = require("../models/Document");
const { createLog } = require("../utils/log");
const cloudinary = require("../config/cloudinary");

// UPLOAD
exports.uploadDocument = async (req, res) => {
  try {
    const { jobId, type } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const newDoc = new Document({
      userId: req.user.id,
      jobApplicationId: jobId,
      documentType: type || "resume",
      filePath: req.file.path,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      storageProvider: "cloudinary",
    });

    await newDoc.save();
    await createLog(
  req.user.id,
  "DOCUMENT_UPLOADED",
  `Uploaded ${type} for job ${jobId}`
);

    res.status(201).json({ message: "File uploaded", data: newDoc });
  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};


exports.getDocuments = async (req, res) => {
  try {
    const { jobId } = req.query;

    let filter = { userId: req.user.id };

    if (jobId) {
      filter.jobApplicationId = jobId;
    }

    const docs = await Document.find(filter)
      .populate("jobApplicationId", "positionTitle company status") // ⭐ IMPORTANT FIX
      .sort({ uploadedAt: -1 });

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// GET BY JOB ID
exports.getDocumentsByJob = async (req, res) => {
  try {
    const docs = await Document.find({
      userId: req.user.id,
      jobApplicationId: req.params.jobId,
    }).populate("jobApplicationId", "positionTitle company");

    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job documents" });
  }
};

// DELETE
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId, {
        resource_type: "raw",
        invalidate: true,
      });
    }

    await Document.findByIdAndDelete(req.params.id);
    await createLog(
  req.user.id,
  "DOCUMENT_DELETED",
  `Deleted a document`
);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
