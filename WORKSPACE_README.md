# HashBet Monorepo

This is a monorepo containing three independent parts of the HashBet platform:

## 📦 Packages

### [frontend/](frontend/)
React UI application (port 3000)
- **Tech**: React, ethers.js, Tailwind CSS
- **Setup**: `cd frontend && npm install && npm start`

### [backend/](backend/)
Express.js API server (port 3001)
- **Tech**: Node.js, Express, PostgreSQL
- **Setup**: `cd backend && npm install && npm run dev`

### [contracts/](contracts/)
Solidity smart contracts (Celo)
- **Tech**: Solidity, Hardhat, Celo
- **Setup**: `cd contracts && npm install && npm run compile`

## 🚀 Development

### All-in-one start (requires all prerequisites)

```bash
# Terminal 1: Frontend
cd frontend && npm install && npm start

# Terminal 2: Backend
cd backend && npm install && npm run dev

# Terminal 3: Contracts (optional, for testing)
cd contracts && npm install && npm run test
```

### Individual development

```bash
# Frontend only
cd frontend && npm start

# Backend only
cd backend && npm run dev

# Contracts only
cd contracts && npx hardhat test
```

## 🔗 Inter-service Communication

```
Frontend ---HTTP---> Backend ---Database---> PostgreSQL
   ↓
   Smart Contract (on-chain)
```

## 📚 Documentation

- [Frontend Docs](frontend/README.md)
- [Backend Docs](backend/README.md)
- [Smart Contracts Docs](contracts/README.md)
- [Data Fetching Guide](DATA_FETCHING_GUIDE.md)
- [Modularization Guide](MODULARIZATION_GUIDE.md)

## 🗂️ Quick Reference

| Folder | Purpose | Port | Tech |
|--------|---------|------|------|
| `frontend/` | Web UI | 3000 | React |
| `backend/` | API Server | 3001 | Node.js/Express |
| `contracts/` | Smart Contracts | N/A | Solidity |

## ✅ Checklist

- [ ] Install dependencies in all folders
- [ ] Setup PostgreSQL for backend
- [ ] Copy .env files and fill variables
- [ ] Run migrations (`backend: npm run migrate`)
- [ ] Compile contracts (`contracts: npm run compile`)
- [ ] Start all services
- [ ] Test API endpoints
- [ ] Test wallet connection

## 🤝 Contributing

1. Make changes in respective folder
2. Test locally
3. Submit pull request

---

**Start development now!** See individual README files for setup details.
