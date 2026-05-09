const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  getDocumentsByJob,
  deleteDocument,
} = require("../controllers/documentController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("file"), uploadDocument);

router.get("/", protect, getDocuments);

router.get("/job/:jobId", protect, getDocumentsByJob);

router.delete("/:id", protect, deleteDocument);

module.exports = router;