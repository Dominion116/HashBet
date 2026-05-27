const crypto = require("crypto");

function randomAddress() {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

function randomHash() {
  return "0x" + crypto.randomBytes(32).toString("hex");
}

function makeBet(overrides = {}) {
  return {
    hash: randomHash(),
    choice: "Big",
    amount: 0.05,
    payout: 0.094,
    result: "win",
    blockNumber: 12345678,
    ...overrides,
  };
}

function makeUser(overrides = {}) {
  return {
    address: randomAddress(),
    ...overrides,
  };
}

function makeLeaderboardEntry(overrides = {}) {
  return {
    address: randomAddress(),
    total_bets: 10,
    wins: 6,
    win_rate: 60,
    net: 0.28,
    ...overrides,
  };
}

function makeBetHistory(count = 5) {
  return Array.from({ length: count }, (_, i) =>
    makeBet({
      result: i % 2 === 0 ? "win" : "lose",
      amount: 0.02 + i * 0.01,
    })
  );
}

module.exports = {
  randomAddress,
  randomHash,
  makeBet,
  makeUser,
  makeLeaderboardEntry,
  makeBetHistory,
};
