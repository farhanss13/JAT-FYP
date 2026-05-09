const User = require("../models/User");
const Job = require("../models/JobApplication");
const Document = require("../models/Document");   
const Reminder = require("../models/Reminder");   
const Settings = require("../models/Settings");

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalJobs = await Job.countDocuments();
    const totalDocuments = await Document.countDocuments();   
    const totalReminders = await Reminder.countDocuments();  

    res.json({
      totalUsers,
      totalJobs,
      totalDocuments,   
      totalReminders,  
    });

  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Get jobs of a specific user
exports.getUserJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.params.id });
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete any job
exports.deleteJobAdmin = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// 👥 Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    const usersWithJobs = await Promise.all(
      users.map(async (user) => {
        const jobCount = await Job.countDocuments({ userId: user._id });
        return { ...user._doc, jobCount };
      })
    );

    res.json(usersWithJobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//Delete user +  jobs
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    await Job.deleteMany({ userId: user._id });

    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

//Get all jobs (admin)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("userId", "email");
    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Settings
exports.getSettings = async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  res.json(settings);
};

// update settings
exports.updateSettings = async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings.emailNotifications = req.body.emailNotifications;
    settings.defaultJobStatus = req.body.defaultJobStatus;
    await settings.save();
  }

  res.json(settings);
};