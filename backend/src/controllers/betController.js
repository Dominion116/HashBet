const Bet = require("../models/Bet");
const User = require("../models/User");

const MIN_BET = 0.02;
const MAX_BET = 0.1;
const TOKEN_SYMBOL = process.env.PAYMENT_TOKEN_SYMBOL || "USDC";

function parseNumeric(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const betController = {
  async createBet(req, res) {
    try {
      const { userId } = req.user;
      const { hash, choice, amount, payout, result, blockNumber } = req.body;

      if (!hash || !choice || amount == null || payout == null || !result) {
        return res.status(400).json({
          success: false,
          error: "Missing required bet fields",
        });
      }

      const parsedAmount = parseNumeric(amount);

      if (parsedAmount < MIN_BET || parsedAmount > MAX_BET) {
        return res.status(400).json({
          success: false,
          error: `Bet amount must be between ${MIN_BET} and ${MAX_BET} ${TOKEN_SYMBOL}`,
        });
      }

      if (!["Big", "Small"].includes(choice)) {
        return res.status(400).json({
          success: false,
          error: "choice must be Big or Small",
        });
      }

      if (!["win", "lose"].includes(result)) {
        return res.status(400).json({
          success: false,
          error: "result must be win or lose",
        });
      }

      const savedBet = await Bet.create(userId, {
        hash,
        choice,
        amount: parsedAmount,
        payout: parseNumeric(payout),
        result,
        blockNumber: blockNumber ?? null,
      });

      res.status(201).json({
        success: true,
        data: {
          id: String(savedBet.id || savedBet._id),
          hash: savedBet.hash,
          choice: savedBet.choice,
          amount: parseFloat(savedBet.amount).toFixed(3),
          payout: parseFloat(savedBet.payout).toFixed(3),
          result: savedBet.result,
          blockNumber: savedBet.block_number ?? savedBet.blockNumber ?? null,
          timestamp: savedBet.created_at,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getBetById(req, res) {
    try {
      const { userId } = req.user;
      const { id } = req.params;
      const history = await Bet.getUserHistory(userId, 100, 0);
      const bet = history.find(
        (entry) => String(entry.id || entry._id) === String(id)
      );

      if (!bet) {
        return res.status(404).json({ success: false, error: "Bet not found" });
      }

      res.json({
        success: true,
        data: {
          id: String(bet.id || bet._id),
          hash: bet.hash,
          choice: bet.choice,
          amount: parseFloat(bet.amount).toFixed(3),
          payout: parseFloat(bet.payout).toFixed(3),
          result: bet.result,
          blockNumber: bet.block_number ?? bet.blockNumber ?? null,
          timestamp: bet.created_at,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getMyBets(req, res) {
    try {
      const { userId } = req.user;
      const { limit = 20, offset = 0 } = req.query;
      const bets = await Bet.getUserHistory(
        userId,
        Number.parseInt(limit, 10) || 20,
        Number.parseInt(offset, 10) || 0
      );

      res.json({
        success: true,
        data: bets.map((bet) => ({
          id: String(bet.id || bet._id),
          hash: bet.hash,
          choice: bet.choice,
          amount: parseFloat(bet.amount).toFixed(3),
          payout: parseFloat(bet.payout).toFixed(3),
          result: bet.result,
          blockNumber: bet.block_number ?? bet.blockNumber ?? null,
          timestamp: bet.created_at,
        })),
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
};

module.exports = betController;
