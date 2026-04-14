require("dotenv").config();
const { JsonRpcProvider, Contract, formatEther } = require("ethers");
const { connectDatabase, isMongoConnected, mongoose } = require("../config/database");
const User = require("../models/User");
const Bet = require("../models/Bet");

const CONTRACT_ABI = [
  "function totalBetsPlaced() view returns (uint256)",
  "function bets(uint256) view returns (address player, uint256 amount, bool isBig, uint256 blockNumber, bytes32 blockHash, bool settled, bool won, uint256 timestamp)",
];

function toBackendHash(blockHash) {
  return String(blockHash || "").replace(/^0x/i, "").toUpperCase();
}

function toBetAmount(amountWei) {
  return Number.parseFloat(formatEther(amountWei));
}

async function main() {
  const rpcUrl = process.env.CELO_RPC_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    throw new Error("Missing CELO_RPC_URL or CONTRACT_ADDRESS in backend .env");
  }

  await connectDatabase();

  if (!isMongoConnected()) {
    throw new Error("MongoDB is not connected; backfill requires persistent DB");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const contract = new Contract(contractAddress, CONTRACT_ABI, provider);

  const totalBetsPlaced = Number(await contract.totalBetsPlaced());
  console.log(`Scanning ${totalBetsPlaced} on-chain bets from ${contractAddress}`);

  let inserted = 0;
  let skipped = 0;

  for (let betId = 0; betId < totalBetsPlaced; betId++) {
    const [player, amountWei, isBig, blockNumber, blockHash, settled, won] = await contract.bets(betId);

    if (!settled) {
      skipped += 1;
      continue;
    }

    const user = (await User.findByAddress(player)) || (await User.create(player));
    const userId = String(user.id || user._id);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      skipped += 1;
      continue;
    }

    const amount = toBetAmount(amountWei);
    const payout = Number.parseFloat((amount * 1.88).toFixed(4));
    const choice = isBig ? "Big" : "Small";
    const result = won ? "win" : "lose";
    const hash = toBackendHash(blockHash);
    const numericBlock = Number(blockNumber);

    const existing = await Bet.Model.findOne({
      user_id: new mongoose.Types.ObjectId(userId),
      block_number: numericBlock,
      choice,
      amount,
      result,
    }).lean();

    if (existing) {
      skipped += 1;
      continue;
    }

    await Bet.create(userId, {
      hash,
      choice,
      amount,
      payout,
      result,
      blockNumber: numericBlock,
    });

    inserted += 1;
  }

  console.log(`Backfill complete. Inserted: ${inserted}, skipped: ${skipped}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(`Backfill failed: ${err.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
