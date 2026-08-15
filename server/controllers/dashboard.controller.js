import { Analysis } from '../models/Analysis.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalAnalyses = await Analysis.countDocuments({ userId });
    
    const highRiskCount = await Analysis.countDocuments({ 
      userId, 
      riskScore: { $gte: 61 } 
    });

    const lowRiskCount = await Analysis.countDocuments({ 
      userId, 
      riskScore: { $lte: 40 } 
    });

    // Aggregate by category
    const categoryStats = await Analysis.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Daily volume
    const dailyVolume = await Analysis.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]);

    res.json({
      totalAnalyses,
      highRiskCount,
      lowRiskCount,
      categoryStats: categoryStats.map(stat => ({
        name: stat._id || 'UNKNOWN',
        count: stat.count
      })),
      dailyVolume: dailyVolume.map(stat => ({
        date: stat._id,
        count: stat.count
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
