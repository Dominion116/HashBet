# Project Structure Overview

## Full Architecture

```
HashBet (Root)
│
├── 📁 frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BetPage/
│   │   │   │   ├── index.jsx
│   │   │   │   ├── ChoiceButtons.jsx
│   │   │   │   ├── AmountInput.jsx
│   │   │   │   ├── PayoutDisplay.jsx
│   │   │   │   ├── PlaceBetButton.jsx
│   │   │   │   ├── PhaseHandlers.jsx
│   │   │   │   └── HashReveal.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── HowPage.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── GlowDot.jsx
│   │   │   └── StatsRow.jsx
│   │   ├── constants/
│   │   │   ├── colors.js
│   │   │   ├── fonts.js
│   │   │   └── data.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── hooks/
│   │   │   └── dataHooks.js
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
│
├── 📁 backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   └── leaderboardController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Bet.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── scripts/
│   │   │   └── migrate.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── 📁 contracts/
│   ├── contracts/
│   │   └── HashBet.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── HashBet.test.js
│   ├── hardhat.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── 📄 README.md (Main)
├── 📄 WORKSPACE_README.md
├── 📄 DATA_FETCHING_GUIDE.md
├── 📄 MODULARIZATION_GUIDE.md
└── 📄 .gitignore
```

## Directory Purposes

### Frontend (`frontend/src/`)

| Folder | Purpose |
|--------|---------|
| `components/` | UI components (organized by feature) |
| `constants/` | Design tokens, static data |
| `utils/` | Helper functions |
| `hooks/` | React hooks for data fetching |

### Backend (`backend/src/`)

| Folder | Purpose |
|--------|---------|
| `routes/` | API endpoint definitions |
| `controllers/` | Business logic & request handlers |
| `models/` | Database queries (User, Bet) |
| `middleware/` | Auth, validation, error handling |
| `config/` | Database & environment config |
| `scripts/` | Database migrations |

### Contracts (`contracts/`)

| Folder | Purpose |
|--------|---------|
| `contracts/` | Solidity smart contracts |
| `scripts/` | Deployment & management scripts |
| `test/` | Contract unit tests |

## Component Hierarchy (Frontend)

```
App (Root)
├── Header
│   ├── GlowDot
│   └── Wallet Controls
├── Content Area (Based on Tab)
│   ├── BetPage
│   │   ├── StatsRow
│   │   ├── ChoiceButtons
│   │   ├── AmountInput
│   │   ├── PayoutDisplay
│   │   ├── PlaceBetButton
│   │   ├── PhaseHandlers
│   │   │   ├── ConfirmingPhase
│   │   │   ├── MiningPhase
│   │   │   └── ResultPhase
│   │   └── HashReveal
│   ├── HistoryPage
│   │   └── GlowDot
│   ├── LeaderboardPage
│   │   └── GlowDot
│   └── HowPage
└── BottomNav
    └── Nav Items
```

## API Routes (Backend)

```
POST   /api/auth/login              - Wallet authentication
POST   /api/auth/logout             - Sign out

GET    /api/user/stats              - User statistics (protected)
GET    /api/user/history            - Bet history (protected)

GET    /api/leaderboard             - Leaderboard (public)
```

## Database Schema (Backend)

```
Users Table
├── id (UUID)
├── address (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Bets Table
├── id (UUID)
├── user_id (FK → Users)
├── hash (VARCHAR)
├── choice (VARCHAR)
├── amount (NUMERIC)
├── payout (NUMERIC)
├── result (VARCHAR)
├── block_number (BIGINT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Data Flow

```
User Action
    ↓
Frontend (React)
    ├─→ Wallet (MetaMask)  [Smart Contract Call]
    └─→ Backend API
           ↓
       Database (PostgreSQL)
           ↓
       Response → Frontend → UI Update
```

---

See individual README files for more details:
- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)
- [contracts/README.md](contracts/README.md)
