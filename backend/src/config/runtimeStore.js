const { v4: uuidv4 } = require("uuid");

const users = [];
const bets = [];

function normalizeAddress(address) {
  return String(address || "").toLowerCase();
}

function toDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function createUser(address) {
  const normalizedAddress = normalizeAddress(address);
  let user = users.find((entry) => entry.address === normalizedAddress);

  if (!user) {
    user = {
      id: uuidv4(),
      address: normalizedAddress,
      created_at: new Date(),
      updated_at: new Date(),
    };
    users.push(user);
  }

  return user;
}

function findUserByAddress(address) {
  return users.find((entry) => entry.address === normalizeAddress(address));
}

function createBet(userId, betData) {
  const bet = {
    id: uuidv4(),
    user_id: userId,
    hash: betData.hash,
    choice: betData.choice,
    amount: Number.parseFloat(betData.amount),
    payout: Number.parseFloat(betData.payout),
    result: betData.result,
    block_number: betData.blockNumber ?? null,
    created_at: new Date(),
    updated_at: new Date(),
  };

  bets.unshift(bet);
  return bet;
}

function getUserBets(userId, limit = 20, offset = 0) {
  const parsedLimit = Math.max(1, Number.parseInt(limit, 10) || 20);
  const parsedOffset = Math.max(0, Number.parseInt(offset, 10) || 0);

  return bets
    .filter((bet) => bet.user_id === userId)
    .sort((left, right) => toDate(right.created_at) - toDate(left.created_at))
    .slice(parsedOffset, parsedOffset + parsedLimit);
}

function getUserStats(userId) {
  const userBets = bets.filter((bet) => bet.user_id === userId);
  const wins = userBets.filter((bet) => bet.result === "win").length;
  const losses = userBets.filter((bet) => bet.result === "lose").length;
  const net = userBets.reduce((total, bet) => {
    return total + (bet.result === "win" ? bet.payout - bet.amount : -bet.amount);
  }, 0);

  return {
    total_bets: userBets.length,
    wins,
    losses,
    net,
  };
}

function getLeaderboard(period = "week", limit = 50) {
  const parsedLimit = Math.max(1, Math.min(Number.parseInt(limit, 10) || 50, 100));
  const daysByPeriod = {
    day: 1,
    week: 7,
    month: 30,
    alltime: 3650,
  };
  const cutoff = new Date(Date.now() - daysByPeriod[period] * 24 * 60 * 60 * 1000);

  const leaderboardMap = new Map();

  for (const bet of bets) {
    if (toDate(bet.created_at) < cutoff) {
      continue;
    }

    const user = users.find((entry) => entry.id === bet.user_id);
    if (!user) {
      continue;
    }

    const current = leaderboardMap.get(user.id) || {
      address: user.address,
      total_bets: 0,
      wins: 0,
      net: 0,
    };

    current.total_bets += 1;
    if (bet.result === "win") {
      current.wins += 1;
      current.net += bet.payout - bet.amount;
    } else {
      current.net -= bet.amount;
    }

    leaderboardMap.set(user.id, current);
  }

  return Array.from(leaderboardMap.values())
    .map((entry) => ({
      ...entry,
      win_rate: entry.total_bets ? Math.round((entry.wins / entry.total_bets) * 100) : 0,
    }))
    .sort((left, right) => right.net - left.net)
    .slice(0, parsedLimit);
}

module.exports = {
  createUser,
  findUserByAddress,
  createBet,
  getUserBets,
  getUserStats,
  getLeaderboard,
};
