const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const Settings = require("../models/Settings"); 
const { sendEmail } = require("../services/emailService");

cron.schedule("* * * * *", async () => {
  console.log("Checking reminders...");

  try {
    const now = new Date();

    const dueReminders = await Reminder.find({
      reminderDate: { $lte: now },
      status: "Pending",
    });

    const settings = await Settings.findOne();

    for (let reminder of dueReminders) {
      const user = await User.findById(reminder.userId);

      
      if (settings?.emailNotifications && user?.email) {
        await sendEmail(
          user.email,
          "Reminder Alert 🚀",
          `Reminder: ${reminder.reminderType}`
        );
      }

      reminder.status = "Triggered";
      await reminder.save();

      console.log("✅ Reminder Triggered:", reminder._id);
    }

  } catch (err) {
    console.log("❌ Cron error:", err.message);
  }
});