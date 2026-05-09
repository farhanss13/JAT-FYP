const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { createLog } = require("../utils/log");


exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
      await createLog(
  user._id,
  "USER_REGISTERED",
 `New user registered: ${user.name} (${user.email})`
);
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const MAX_LOGIN_ATTEMPTS = 10;
  const LOCKOUT_MS = 15 * 60 * 1000; // temporary lock duration after hitting max failures

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const now = Date.now();

    if (user.lockUntil && user.lockUntil.getTime() > now) {
      const minsLeft = Math.ceil((user.lockUntil.getTime() - now) / 60000);
      return res.status(423).json({
        message: `Account temporarily locked after ${MAX_LOGIN_ATTEMPTS} failed login attempts. Try again in about ${minsLeft} minute(s).`,
      });
    }

    // Lock period expired — reset counters
    if (user.lockUntil && user.lockUntil.getTime() <= now) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(now + LOCKOUT_MS);
        await user.save();
        return res.status(423).json({
          message: `Account temporarily locked after ${MAX_LOGIN_ATTEMPTS} failed login attempts. Try again in ${LOCKOUT_MS / 60000} minutes.`,
        });
      }

      await user.save();
      return res.status(400).json({ message: "Invalid email or password" });
    }

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset Request</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link expires in 15 minutes.</p>
    `;

    await sendEmail(user.email, "Password Reset", message);

    res.json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};