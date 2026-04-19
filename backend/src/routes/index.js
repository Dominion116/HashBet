const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const leaderboardController = require("../controllers/leaderboardController");
const betController = require("../controllers/betController");
const configController = require("../controllers/configController");
const contractController = require("../controllers/contractController");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Auth routes
router.post("/auth/login", authController.login);
router.post("/auth/logout", authMiddleware, authController.logout);

// User routes (protected)
router.get("/user/stats", authMiddleware, userController.getStats);
router.get("/user/history", authMiddleware, userController.getHistory);

// Betting routes (protected)
router.post("/bets", authMiddleware, betController.createBet);
router.get("/bets", authMiddleware, betController.getMyBets);
router.get("/bets/:id", authMiddleware, betController.getBetById);

// Public routes
router.get("/leaderboard", leaderboardController.getLeaderboard);
router.get("/config/public", configController.getPublicConfig);
router.get("/contract/state", contractController.getContractState);

// Debug endpoint (TEMPORARY - for troubleshooting)
router.get("/debug/db-status", async (req, res) => {
  try {
    const User = require("../models/User");
    const Bet = require("../models/Bet");
    const { isMongoConnected } = require("../config/database");
    
    const mongoConnected = isMongoConnected();
    
    // Get counts
    let userCount = 0;
    let betCount = 0;
    
    if (mongoConnected) {
      userCount = await User.Model.countDocuments();
      betCount = await Bet.Model.countDocuments();
    }
    
    res.json({
      mongoConnected,
      userCount,
      betCount,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug: Show all users and their bets
router.get("/debug/users-bets", async (req, res) => {
  try {
    const User = require("../models/User");
    const Bet = require("../models/Bet");
    const { isMongoConnected } = require("../config/database");
    
    if (!isMongoConnected()) {
      return res.json({ error: "MongoDB not connected" });
    }
    
    const users = await User.Model.find().lean();
    const bets = await Bet.Model.find().lean();
    
    const userBets = users.map(u => {
      const userBetList = bets.filter(b => b.user_id.toString() === u._id.toString());
      return {
        user: { _id: u._id.toString(), address: u.address },
        betCount: userBetList.length,
        bets: userBetList.map(b => ({
          _id: b._id.toString(),
          choice: b.choice,
          amount: b.amount,
          result: b.result,
          created_at: b.created_at,
        })),
      };
    });
    
    res.json({ users: userBets, totalUsers: users.length, totalBets: bets.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
