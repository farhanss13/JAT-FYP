const Reminder = require("../models/Reminder");

exports.addReminder = async (req, res) => {
  try {
    const { jobApplicationId, reminderDate, reminderType } = req.body;

    const reminder = await Reminder.create({
      userId: req.user.id,
      jobApplicationId,
      reminderDate,
      reminderType,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user.id })
      .populate("jobApplicationId", "positionTitle")
      .sort({ reminderDate: 1 });

    res.status(200).json(reminders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    reminder.status = "Done";

    const updated = await reminder.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    reminder.isRead = true;
    await reminder.save();

    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    if (reminder.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await reminder.deleteOne();

    res.status(200).json({ message: "Reminder deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};