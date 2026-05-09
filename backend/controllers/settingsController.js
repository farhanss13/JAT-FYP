const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings({
        emailNotifications: req.body.emailNotifications,
        defaultJobStatus: req.body.defaultJobStatus,
      });
    } else {
      settings.emailNotifications = req.body.emailNotifications;
      settings.defaultJobStatus = req.body.defaultJobStatus;
    }

    await settings.save();

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};