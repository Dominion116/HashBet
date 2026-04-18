# Backend API for HashBet

### Node.js + Express + MongoDB

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run migrate  # Sync MongoDB indexes
npm run dev
```

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. Create a database user with read/write access.
3. Add your current IP address to the Atlas Network Access list, or allow access from your dev machine.
4. Copy the Atlas connection string into `MONGODB_URI` in `backend/.env`.
5. Replace `<username>`, `<password>`, and `<cluster-name>` in the URI.
6. Run `npm run migrate` to sync indexes.
7. Start the backend with `npm run dev`.

## API Endpoints

### API Docs
- `GET /docs` - Swagger UI
- `GET /docs.json` - OpenAPI JSON

### Authentication
- `POST /api/auth/login` - Sign in with wallet
- `POST /api/auth/logout` - Sign out

### User
- `GET /api/user/stats` - Get user stats
- `GET /api/user/history` - Get betting history

### Betting
- `POST /api/bets` - Place a bet
- `GET /api/bets` - Get the authenticated user's bets
- `GET /api/bets/:id` - Get bet details

### Leaderboard
- `GET /api/leaderboard?period=week&limit=50` - Get leaderboard

### Config / Contract
- `GET /api/config/public` - Get public chain + contract config
- `GET /api/contract/state` - Get on-chain contract state

## Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/hashbet?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRY=7d

# Blockchain
CELO_RPC_URL=https://forno.celo.org
CELO_CHAIN_ID=42220
CONTRACT_ADDRESS=0x...

# Deployment URLs
FRONTEND_URL=https://hashbetcelo.vercel.app
API_URL=https://hashbet.onrender.com
```

## Runtime Notes

- If `MONGODB_URI` points to MongoDB Atlas, the API persists data there.
- If Atlas is unavailable or the URI is not set, the API falls back to an in-memory runtime store so endpoints still respond.
- To reset all users and bets for a clean restart, run `RESET_DB_CONFIRM=YES_RESET_HASHBET npm run db:reset`.
