const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.fullName !== undefined) {
      user.fullName = req.body.fullName;
    }

    if (req.body.careerPreferences !== undefined) {
      user.careerPreferences = req.body.careerPreferences;
    }

    const updated = await user.save();

    res.json({
      _id: updated._id,
      fullName: updated.fullName,
      email: updated.email,
      role: updated.role,
      careerPreferences: updated.careerPreferences,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};