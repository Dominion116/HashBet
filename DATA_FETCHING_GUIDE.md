# Data Fetching Strategy for HashBet

## Overview
The modularized UI is now ready to integrate with a backend for fetching user history and leaderboard data.

---

## 1. USER HISTORY

### Current State (Frontend-only)
- History stored in local state (`localHistory`)
- Max 20 bets retained in memory
- Resets on page refresh

### Backend Solution

#### Option A: REST API (Recommended for MVP)

**Endpoint:**
```
GET /api/user/history?limit=20&offset=0
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "bet_12345",
      "hash": "ABCDEF1234567890...",
      "choice": "Big",
      "amount": 1.5,
      "payout": 2.82,
      "result": "win",
      "blockNumber": 28447201,
      "timestamp": "2026-04-11T14:30:00Z"
    }
  ],
  "total": 150
}
```

**Implementation in React:**
```javascript
import { useEffect, useState } from "react";

function useBetHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/user/history?limit=20");
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { history, loading, error };
}
```

#### Option B: GraphQL (Better for complex queries)

**Query:**
```graphql
query GetUserHistory($limit: Int!, $offset: Int!) {
  userHistory(limit: $limit, offset: $offset) {
    id
    hash
    choice
    amount
    payout
    result
    blockNumber
    timestamp
  }
}
```

---

## 2. LEADERBOARD

### Current State (Frontend-only)
- Hardcoded fake data in `constants/data.js`
- `FAKE_LEADERBOARD` array

### Backend Solution

#### Option A: REST API

**Endpoint:**
```
GET /api/leaderboard?period=week&limit=50
```

**Query Parameters:**
- `period`: "day" | "week" | "month" | "alltime"
- `limit`: number of top players (default 7)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "address": "0xA3F2...81CE",
      "wins": 142,
      "net": "+312.4",
      "totalBets": 200,
      "winRate": "71%"
    }
  ],
  "period": "week",
  "updatedAt": "2026-04-11T10:00:00Z"
}
```

**React Hook:**
```javascript
function useLeaderboard(period = "week", limit = 50) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `/api/leaderboard?period=${period}&limit=${limit}`
        );
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [period, limit]);

  return { leaderboard, loading, error };
}
```

---

## 3. USER STATS

### Current State
- Local state tracking wins/losses/net P&L
- Resets on refresh

### Backend Solution

**Endpoint:**
```
GET /api/user/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "wins": 45,
    "losses": 55,
    "net": "+123.45",
    "totalBets": 100,
    "winRate": "45%",
    "volume": "500.00",
    "joinedAt": "2026-03-01T00:00:00Z"
  }
}
```

---

## 4. ARCHITECTURE RECOMMENDATIONS

### Required Backend Components

#### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  address VARCHAR(42) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bets table
CREATE TABLE bets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  hash VARCHAR(64),
  choice VARCHAR(5), -- "Big" or "Small"
  amount DECIMAL(18, 4),
  payout DECIMAL(18, 4),
  result VARCHAR(10), -- "win" or "lose"
  block_number BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard (denormalized stats)
CREATE TABLE leaderboard_stats (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  net DECIMAL(18, 4) DEFAULT 0,
  period VARCHAR(20),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### API Middleware Pattern
```javascript
// Backend example (Node.js/Express)
app.get("/api/user/history", authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const { limit = 20, offset = 0 } = req.query;
  
  const history = await db.bets.find({ userId })
    .sort({ created_at: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(offset));
  
  res.json({ success: true, data: history });
});
```

---

## 5. AUTHENTICATION FLOW

### Wallet Connection Integration
```javascript
async function connectWallet() {
  // 1. Connect wallet via Web3Modal or ethers.js
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const address = await signer.getAddress();
  
  // 2. Sign message for verification
  const message = `Sign in to HashBet\n\nAddress: ${address}`;
  const signature = await signer.signMessage(message);
  
  // 3. Send to backend
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, signature, message })
  });
  
  const { token } = await res.json();
  localStorage.setItem("authToken", token);
  
  setWalletAddr(address);
  setWalletConnected(true);
}
```

---

## 6. CACHING STRATEGY

### Frontend Caching
```javascript
const cacheKeys = {
  HISTORY: "hashbet_history",
  LEADERBOARD: "hashbet_leaderboard",
  STATS: "hashbet_stats"
};

const cacheConfig = {
  HISTORY: { ttl: 60 * 1000 }, // 1 minute
  LEADERBOARD: { ttl: 30 * 1000 }, // 30 seconds
  STATS: { ttl: 60 * 1000 } // 1 minute
};
```

---

## 7. IMPLEMENTATION CHECKLIST

### Phase 1: Backend Setup
- [ ] Create database schema
- [ ] Build authentication endpoints
- [ ] Implement history API
- [ ] Implement leaderboard API
- [ ] Add stats aggregation

### Phase 2: Frontend Integration
- [ ] Create custom hooks (`useHistory`, `useLeaderboard`, `useStats`)
- [ ] Replace mock data in components
- [ ] Add loading/error states
- [ ] Implement caching

### Phase 3: Testing & Optimization
- [ ] Test with real Celo blockchain
- [ ] Add pagination for history
- [ ] Optimize database queries
- [ ] Add WebSocket support for real-time updates (optional)

---

## 8. DEPLOYMENT NOTES

### Environment Variables Needed
```env
REACT_APP_API_URL=https://api.hashbet.io
REACT_APP_CHAIN_ID=42220 # Celo Mainnet
REACT_APP_CONTRACT_ADDRESS=0x...
```

### Backend Requirements
- Node.js / Python / Go server
- PostgreSQL or MongoDB
- Redis for caching (optional)
- Rate limiting on public endpoints
