const { mongoose, isMongoConnected } = require("../config/database");
const runtimeStore = require("../config/runtimeStore");

const userSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

class User {
  static async create(address) {
    const fallbackUser = runtimeStore.createUser(address);

    try {
      if (!isMongoConnected()) {
        return fallbackUser;
      }

      const user = await UserModel.findOneAndUpdate(
        { address: String(address).toLowerCase() },
        { $setOnInsert: { address: String(address).toLowerCase() } },
        { upsert: true, new: true }
      ).lean();

      return user;
    } catch (err) {
      return fallbackUser;
    }
  }

  static async findByAddress(address) {
    try {
      if (!isMongoConnected()) {
        return runtimeStore.findUserByAddress(address);
      }

      return await UserModel.findOne({
        address: String(address).toLowerCase(),
      }).lean();
    } catch (err) {
      return runtimeStore.findUserByAddress(address);
    }
  }

  static async getStats(userId) {
    try {
      if (!isMongoConnected()) {
        return runtimeStore.getUserStats(userId);
      }

      if (!mongoose.Types.ObjectId.isValid(String(userId))) {
        return runtimeStore.getUserStats(userId);
      }

      const Bet = require("./Bet");
      const targetId = new mongoose.Types.ObjectId(String(userId));

      const agg = await Bet.Model.aggregate([
        { $match: { user_id: targetId } },
        {
          $group: {
            _id: null,
            total_bets: { $sum: 1 },
            wins: {
              $sum: {
                $cond: [{ $eq: ["$result", "win"] }, 1, 0],
              },
            },
            losses: {
              $sum: {
                $cond: [{ $eq: ["$result", "lose"] }, 1, 0],
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
      ]);

      return (
        agg[0] || {
          total_bets: 0,
          wins: 0,
          losses: 0,
          net: 0,
        }
      );
    } catch (err) {
      return runtimeStore.getUserStats(userId);
    }
  }
}

User.Model = UserModel;

module.exports = User;
