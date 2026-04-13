# 🎰 HashBet - Provably Fair Betting on Celo

A full-stack decentralized betting application built on the Celo blockchain. Players predict if the first hex character of the next block hash is Big (8-F) or Small (0-7) with provably fair outcome determination.

## Live Deployment

- Frontend: https://hashbetcelo.vercel.app/
- Backend API: https://hashbet.onrender.com/
- Backend Swagger Docs: https://hashbet.onrender.com/docs/

## 📁 Project Structure

```
HashBet/
├── frontend/              # React UI
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── constants/    # Colors, fonts, data
│   │   ├── utils/        # Helper functions
│   │   ├── hooks/        # Custom data hooks
│   │   └── App.jsx       # Root component
│   ├── package.json
│   └── README.md
│
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth & validation
│   │   ├── config/       # Database config
│   │   └── index.js      # Server entry
│   ├── package.json
│   └── README.md
│
└── contracts/           # Solidity smart contracts
    ├── contracts/       # .sol files
    ├── scripts/         # Deployment scripts
    ├── test/            # Contract tests
    ├── hardhat.config.js
    └── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- MongoDB Atlas (for backend)
- MetaMask or compatible Celo wallet

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection string
npm run migrate
npm run dev
```
API runs on `http://localhost:3001`

### 3. Smart Contracts Setup

```bash
cd contracts
npm install
cp .env.example .env
# Add PRIVATE_KEY and deploy keys to .env
npm run compile
npm run test
npm run deploy:testnet
```

## 🔧 Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Frontend (React)                       │
│  - Modular components (BetPage, History, Leaderboard)    │
│  - Custom hooks for data fetching                        │
│  - Wallet integration (ethers.js)                        │
└──────────────────┬───────────────────────────────────────┘
                   │ API Calls + WebSocket
┌──────────────────┴───────────────────────────────────────┐
│                 Backend (Express.js)                      │
│  - Authentication (Wallet signatures)                     │
│  - User history & stats                                  │
│  - Leaderboard aggregation                               │
│  - MongoDB Atlas                                         │
└──────────────────┬───────────────────────────────────────┘
                   │ Contract calls
┌──────────────────┴───────────────────────────────────────┐
│          Smart Contracts (Solidity/Celo)                 │
│  - Place bets                                            │
│  - Settle bets using block hashes                        │
│  - Manage betting pool                                   │
│  - Provably fair RNG                                     │
└──────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### Placing a Bet
1. User connects wallet (MetaMask)
2. Frontend calls `placeBet(Big/Small)` on smart contract
3. Backend logs bet to database
4. Contract locks amount in pool, sets target block

### Settlement
1. Target block is mined
2. User or keeper calls `settleBet(betId)`
3. Contract extracts first hex char from block hash
4. Winner determined → payout automatically transferred
5. Backend updates history & stats

## 🔐 Security Features

- ✅ Wallet signature verification (no passwords)
- ✅ On-chain RNG using block hash (tamper-proof)
- ✅ Automatic payout via smart contract
- ✅ 6% house edge (transparent)
- ✅ JWT tokens for API authentication
- ✅ Rate limiting on endpoints

## 📱 Features

| Feature | Status | Location |
|---------|--------|----------|
| Wallet connection | ✅ Complete | Frontend + Backend |
| Place bets | ✅ Complete | Frontend + Contract |
| Bet history (local) | ✅ Complete | Frontend |
| Leaderboard (mock) | ✅ Complete | Frontend |
| User stats | ✅ Backend ready | Backend API |
| Real history | 🔧 In progress | Backend + Frontend |
| Real leaderboard | 🔧 In progress | Backend + Frontend |
| Smart contract | ✅ Complete | Contracts folder |

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { address, signature, message }
Returns: { token, user }
```

### User (Protected)
```
GET /api/user/stats
GET /api/user/history?limit=20&offset=0
```

### Public
```
GET /api/leaderboard?period=week&limit=50
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

### Smart Contracts
```bash
cd contracts
npm test
npm run test -- --coverage
```

## 📈 Performance Targets

- **Frontend**: < 3s page load
- **API**: < 200ms average response
- **Blockchain**: < 2 block confirmation
- **Leaderboard**: Real-time top 50 players

## 🔗 Network Configuration

| Network | Chain ID | Status |
|---------|----------|--------|
| Celo Sepolia | 11142220 | ✅ Active Deployment |
| Celo Mainnet | 42220 | ✅ Supported |

## 📝 Environment Setup

### Frontend (.env)
```env
VITE_API_BASE_URL=https://hashbet.onrender.com
VITE_CHAIN_ID=11142220
VITE_REOWN_PROJECT_ID=your-reown-project-id
```

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/hashbet?retryWrites=true&w=majority
JWT_SECRET=your-secret-key
FRONTEND_URL=https://hashbetcelo.vercel.app
API_URL=https://hashbet.onrender.com
```

### Contracts (.env)
```env
PRIVATE_KEY=0x...
```

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📄 License

MIT

## 🆘 Support

- Docs: [/frontend/README.md](frontend/README.md), [/backend/README.md](backend/README.md), [/contracts/README.md](contracts/README.md)
- Issues: GitHub Issues
- Contact: support@hashbet.dev

---

**Built with ❤️ on Celo**
