const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User"); // adjust path if needed

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for admin creation");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@test.com" });

    if (existingAdmin) {
      console.log("Admin already exists. Exiting...");
      process.exit();
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const admin = new User({
      fullName: "System Admin",
      email: "admin@test.com",
      password: hashedPassword,
      careerPreferences: "",
      role: "admin",
      loginAttempts: 0,
    });

    await admin.save();

    console.log("Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();