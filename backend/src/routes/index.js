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

module.exports = router;
