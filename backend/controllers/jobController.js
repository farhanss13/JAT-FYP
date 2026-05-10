const Job = require("../models/jobApplication");
const { createLog } = require("../utils/log");
exports.addJob = async (req, res) => {
  try {
    const {
      positionTitle,
      company,
      dateApplied,
      jobLink,
      contact,
      status,
    } = req.body;

   const job = await Job.create({
  userId: req.user.id,
  positionTitle,
  company: company || "",
  dateApplied,
  jobLink,
  contact,
  status: status || "Applied",
});

await createLog(
  req.user.id,
  "JOB_CREATED",
  `Added job: ${positionTitle} at ${company}`
);

    res.status(201).json({ message: "Job added", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { status, search, startDate, endDate, company } = req.query;

    let query = { userId: req.user.id };

    if (status) query.status = status;

    if (search) {
      query.positionTitle = { $regex: search, $options: "i" };
    }

    if (company) {
      query.company = { $regex: company, $options: "i" };
    }

    if (startDate || endDate) {
      query.dateApplied = {};
      if (startDate) query.dateApplied.$gte = new Date(startDate);
      if (endDate) query.dateApplied.$lte = new Date(endDate);
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Not found" });

    res.status(200).json(job);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Not found" });

    if (job.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const allowed = [
      "positionTitle",
      "company",
      "dateApplied",
      "jobLink",
      "contact",
      "status",
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    const updated = await job.save();
    await createLog(
  req.user.id,
  "JOB_UPDATED",
  `Updated job: ${job.positionTitle}`
);

    res.status(200).json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: "Not found" });

    if (job.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    await createLog(
  req.user.id,
  "JOB_DELETED",
  `Deleted job: ${job.positionTitle}`
);

    res.status(200).json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
