const Job = require("../models/jobApplication");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total jobs
    const totalJobs = await Job.countDocuments({ userId });

    const stats = await Job.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    stats.forEach(item => {
      statusStats[item._id] = item.count;
    });

    res.status(200).json({
      totalJobs,
      statusStats
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
