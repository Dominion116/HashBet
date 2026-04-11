const Bet = require("../models/Bet");

const leaderboardController = {
  async getLeaderboard(req, res) {
    try {
      const { period = "week", limit = 50 } = req.query;
      const parsedLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 50, 100));

      if (!["day", "week", "month", "alltime"].includes(period)) {
        return res.status(400).json({
          success: false,
          error: "Invalid period",
        });
      }

      const leaderboard = await Bet.getLeaderboard(period, parsedLimit);

      res.json({
        success: true,
        data: leaderboard.map((entry, idx) => ({
          rank: idx + 1,
          address: entry.address,
          wins: Number(entry.wins || 0),
          net: Number.parseFloat(entry.net || 0).toFixed(1),
          totalBets: Number(entry.total_bets || 0),
          winRate: Number(entry.win_rate || 0),
        })),
        period,
        updatedAt: new Date(),
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = leaderboardController;
