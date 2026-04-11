# Frontend - HashBet React UI

Modern, modular React application for the HashBet betting platform.

## 📁 Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── BetPage/          # Bet placement flow
│   │   │   ├── index.jsx
│   │   │   ├── ChoiceButtons.jsx
│   │   │   ├── AmountInput.jsx
│   │   │   ├── PayoutDisplay.jsx
│   │   │   ├── PlaceBetButton.jsx
│   │   │   ├── PhaseHandlers.jsx
│   │   │   └── HashReveal.jsx
│   │   ├── HistoryPage.jsx
│   │   ├── LeaderboardPage.jsx
│   │   ├── HowPage.jsx
│   │   ├── Header.jsx
│   │   ├── BottomNav.jsx
│   │   ├── GlowDot.jsx
│   │   └── StatsRow.jsx
│   ├── constants/
│   │   ├── colors.js
│   │   ├── fonts.js
│   │   └── data.js
│   ├── utils/
│   │   └── helpers.js
│   ├── hooks/
│   │   └── dataHooks.js       # API data fetching hooks
│   └── App.jsx
├── package.json
└── README.md
```

## 🎨 Design System

### Colors (from constants/colors.js)
- **Primary**: Green (`#00FF87`) - Secondary: Amber (`#FFB830`)
- **Status**: Green (win), Red (lose)
- **Background**: Dark (`#080C0A`)

### Fonts (from constants/fonts.js)
- **Mono**: IBM Plex Mono (data, labels)
- **Display**: Syne (headings, emphasis)
- **Body**: DM Sans (content)

## 🚀 Getting Started

```bash
npm install
npm start
```

## 🎮 Components

### Page Components
- **BetPage** - Main betting interface
- **HistoryPage** - Recent bets (local storage)
- **LeaderboardPage** - Top players (mock data)
- **HowPage** - Game rules & odds

### Sub-components
- **ChoiceButtons** - Big/Small selection
- **AmountInput** - Bet amount with presets
- **PayoutDisplay** - Potential winnings
- **PhaseHandlers** - Confirming/Mining/Result states
- **HashReveal** - Block hash display

## 🎯 Key Features

✅ Wallet connection (MetaMask)
✅ Real-time block updates
✅ Animated state transitions
✅ Responsive design (420px mobile-first)
✅ Dark theme with glowing effects

## 🔗 API Integration

### Custom Hooks (from hooks/dataHooks.js)

```javascript
// Fetch user history
const { history, loading, error } = useBetHistory(limit);

// Fetch leaderboard
const { leaderboard, loading, error } = useLeaderboard(period, limit);

// Fetch user stats
const { stats, loading, error } = useUserStats();
```

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px+
- **App Width**: Max 420px (mobile-first)

## 🎬 Animations

- `pulse` - Glow dot animation
- `slideIn` - History entry animation
- `fadeIn` - Phase transitions
- `resultPop` - Win/lose result animation

## 🧪 Testing

Components are designed to be easily testable. Import and render with mock props:

```javascript
import { BetPage } from "./components/BetPage";

<BetPage
  walletConnected={true}
  connectWallet={mockFn}
  stats={{wins: 5, losses: 3, net: 10}}
  history={[]}
/>
```

## 🔄 State Management

Currently using React hooks. For scalability, consider:
- Redux
- Zustand
- Jotai

## 📈 Performance

- Code splitting via React.lazy()
- Lazy loading images
- Memo components for expensive renders
- useCallback for event handlers

## 🌐 Deployment

### Vercel
```bash
npm run build
# Deploy to Vercel
```

### Docker
```bash
docker build -t hashbet-frontend .
docker run -p 3000:3000 hashbet-frontend
```

## 📚 Documentation

- [Component Guide](docs/COMPONENTS.md)
- [Styling Guide](docs/STYLING.md)
- [API Integration](docs/API.md)

---

See [../README.md](../README.md) for full project info.
