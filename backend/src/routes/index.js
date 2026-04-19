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

// Ensure user exists in MongoDB (call after login)
router.post("/auth/ensure-user", authMiddleware, async (req, res) => {
  try {
    const { userId, address } = req.user;
    const User = require("../models/User");
    const { isMongoConnected } = require("../config/database");
    
    if (!isMongoConnected()) {
      return res.status(503).json({ success: false, error: "Database not available" });
    }
    
    // Try to find user by MongoDB ID
    let user = await User.Model.findById(userId).lean();
    
    if (!user) {
      console.log("[Auth] User not found by ID, searching by address:", address);
      // Try to find by address and use that
      user = await User.Model.findOne({ address: String(address).toLowerCase() }).lean();
    }
    
    if (!user) {
      console.log("[Auth] User not in MongoDB, creating now:", address);
      // Force create in MongoDB
      const { UserModel } = require("../models/User");
      user = await User.Model.findOneAndUpdate(
        { address: String(address).toLowerCase() },
        { $setOnInsert: { address: String(address).toLowerCase() } },
        { upsert: true, new: true }
      ).lean();
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id.toString(),
          address: user.address,
        },
      },
    });
  } catch (err) {
    console.error("[Auth] ensure-user failed:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

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

// Debug: Check runtime store state
router.get("/debug/runtime-store", async (req, res) => {
  try {
    const runtimeStore = require("../config/runtimeStore");
    res.json({
      runtimeUsers: runtimeStore.users ? runtimeStore.users.length : 0,
      runtimeBets: runtimeStore.bets ? runtimeStore.bets.length : 0,
      users: runtimeStore.users || [],
      bets: (runtimeStore.bets || []).slice(-5),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
