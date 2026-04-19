const jwt = require("jsonwebtoken");
const { verifyMessage } = require("ethers");
const User = require("../models/User");

const authController = {
  async login(req, res) {
    try {
      const { address, signature, message } = req.body;

      if (!address || !signature || !message) {
        return res.status(400).json({ success: false, error: "Missing fields" });
      }

      let recoveredAddress;

      try {
        // Verify signature
        recoveredAddress = verifyMessage(message, signature);
      } catch (verifyError) {
        return res.status(400).json({ success: false, error: "Invalid signature" });
      }

      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ success: false, error: "Invalid signature" });
      }

      // Find or create user
      let user = await User.findByAddress(address);
      if (!user) {
        console.log("[Auth] Creating new user for address:", address);
        user = await User.create(address);
        console.log("[Auth] Created user:", { _id: user?.id || user?._id, address: user?.address, hasMongoId: !!user?._id });
      } else {
        console.log("[Auth] Found existing user:", { _id: user?.id || user?._id, address: user?.address });
      }

      if (!user?._id && !user?.id) {
        console.error("[Auth] User creation failed - no ID returned", { user });
        return res.status(500).json({ success: false, error: "User creation failed" });
      }

      const userId = String(user.id || user._id);
      const normalizedAddress = user.address || address.toLowerCase();

      // Create JWT
      const token = jwt.sign(
        { userId, address: normalizedAddress },
        process.env.JWT_SECRET || "hashbet-dev-secret",
        { expiresIn: process.env.JWT_EXPIRY || "7d" }
      );

      res.json({
        success: true,
        data: { token, user: { id: userId, address: normalizedAddress } },
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  logout(req, res) {
    // Client-side token invalidation
    res.json({ success: true, message: "Logged out" });
  },
};

module.exports = authController;
