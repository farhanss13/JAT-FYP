const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-tracker/documents",
    resource_type: "raw",
    allowed_formats: ["pdf", "doc", "docx", "txt"],
    public_id: (req, file) => {
      const extension = path.extname(file.originalname);
      const baseName = path
        .basename(file.originalname, extension)
        .replace(/[^a-zA-Z0-9_-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      return `${req.user?.id || "user"}-${Date.now()}-${baseName || "document"}${extension}`;
    },
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;
