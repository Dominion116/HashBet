const User = require("../models/User");
const Bet = require("../models/Bet");

const userController = {
  async getStats(req, res) {
    try {
      const { userId } = req.user;
      const stats = await User.getStats(userId);
      const totalBets = Number(stats.total_bets || 0);
      const wins = Number(stats.wins || 0);
      const losses = Number(stats.losses || 0);
      const net = Number.parseFloat(stats.net || 0);

      res.json({
        success: true,
        data: {
          total_bets: totalBets,
          wins,
          losses,
          net: net.toFixed(4),
          win_rate: totalBets
            ? Math.round((wins / totalBets) * 100)
            : 0,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getHistory(req, res) {
    try {
      const { userId } = req.user;
      const { limit = 20, offset = 0 } = req.query;

      const history = await Bet.getUserHistory(
        userId,
        Number.parseInt(limit, 10) || 20,
        Number.parseInt(offset, 10) || 0
      );

      res.json({
        success: true,
        data: history.map((b) => ({
          id: String(b.id || b._id),
          hash: b.hash,
          choice: b.choice,
          amount: parseFloat(b.amount).toFixed(3),
          payout: parseFloat(b.payout).toFixed(3),
          result: b.result,
          blockNumber: b.block_number ?? b.blockNumber ?? null,
          timestamp: b.created_at,
        })),
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = userController;
