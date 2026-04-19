const { mongoose, isMongoConnected } = require("../config/database");
const runtimeStore = require("../config/runtimeStore");

const betSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hash: { type: String, required: true },
    choice: { type: String, enum: ["Big", "Small"], required: true },
    amount: { type: Number, required: true },
    payout: { type: Number, required: true },
    result: { type: String, enum: ["win", "lose"], required: true, index: true },
    block_number: { type: Number, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const BetModel = mongoose.models.Bet || mongoose.model("Bet", betSchema);

class Bet {
  static async create(userId, betData) {
    const {
      hash,
      choice,
      amount,
      payout,
      result,
      blockNumber,
    } = betData;

    try {
      if (!isMongoConnected()) {
        console.log("[Bet] MongoDB not connected, using runtime store", { userId });
        return runtimeStore.createBet(userId, betData);
      }

      if (!mongoose.Types.ObjectId.isValid(String(userId))) {
        console.warn("[Bet] Invalid userId format, falling back to runtime store", { userId, type: typeof userId });
        return runtimeStore.createBet(userId, betData);
      }

      console.log("[Bet] Saving to MongoDB", { userId, hash, result });

      const created = await BetModel.create({
        user_id: new mongoose.Types.ObjectId(String(userId)),
        hash,
        choice,
        amount,
        payout,
        result,
        block_number: blockNumber,
      });

      console.log("[Bet] Saved successfully to MongoDB", { _id: created._id, user_id: created.user_id, result });
      return created.toObject();
    } catch (err) {
      console.error("[Bet] Error saving to MongoDB, falling back", { error: err.message, userId });
      return runtimeStore.createBet(userId, betData);
    }
  }

  static async getUserHistory(userId, limit = 20, offset = 0) {
    try {
      if (!isMongoConnected()) {
        return runtimeStore.getUserBets(userId, limit, offset);
      }

      if (!mongoose.Types.ObjectId.isValid(String(userId))) {
        return runtimeStore.getUserBets(userId, limit, offset);
      }

      const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 20);
      const parsedOffset = Math.max(0, Number.parseInt(offset, 10) || 0);

      return await BetModel.find({
        user_id: new mongoose.Types.ObjectId(String(userId)),
      })
        .sort({ created_at: -1 })
        .skip(parsedOffset)
        .limit(parsedLimit)
        .lean();
    } catch (err) {
      return runtimeStore.getUserBets(userId, limit, offset);
    }
  }

  static async getLeaderboard(period = "week", limit = 50) {
    try {
      if (!isMongoConnected()) {
        return runtimeStore.getLeaderboard(period, limit);
      }

      const parsedLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 50, 100));
      const dayMap = { day: 1, week: 7, month: 30, alltime: 3650 };
      const days = dayMap[period] || 7;
      const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      return await BetModel.aggregate([
        { $match: { created_at: { $gte: cutoff } } },
        {
          $group: {
            _id: "$user_id",
            total_bets: { $sum: 1 },
            wins: {
              $sum: {
                $cond: [{ $eq: ["$result", "win"] }, 1, 0],
              },
            },
            net: {
              $sum: {
                $cond: [
                  { $eq: ["$result", "win"] },
                  { $subtract: ["$payout", "$amount"] },
                  { $multiply: ["$amount", -1] },
                ],
              },
            },
          },
        },
        {
          $addFields: {
            win_rate: {
              $cond: [
                { $gt: ["$total_bets", 0] },
                { $round: [{ $multiply: [{ $divide: ["$wins", "$total_bets"] }, 100] }, 2] },
                0,
              ],
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: 0,
            address: {
              $ifNull: ["$user.address", { $toString: "$_id" }],
            },
            total_bets: 1,
            wins: 1,
            win_rate: 1,
            net: 1,
          },
        },
        { $sort: { net: -1 } },
        { $limit: parsedLimit },
      ]);
    } catch (err) {
      return runtimeStore.getLeaderboard(period, limit);
    }
  }
}

Bet.Model = BetModel;

module.exports = Bet;
