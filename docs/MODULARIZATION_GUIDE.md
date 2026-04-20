# HashBet UI Modularization - File Structure

## Project Structure

```
src/
├── App.jsx                          # Root component
│
├── components/
│   ├── GlowDot.jsx                 # Reusable glow dot indicator
│   ├── StatsRow.jsx                # Stats display component
│   ├── Header.jsx                  # App header with wallet connection
│   ├── BottomNav.jsx               # Bottom navigation tabs
│   ├── HistoryPage.jsx             # Bet history page
│   ├── LeaderboardPage.jsx         # Leaderboard page
│   ├── HowPage.jsx                 # How it works page
│   │
│   └── BetPage/
│       ├── index.jsx               # Main bet page component
│       ├── ChoiceButtons.jsx       # Big/Small choice buttons
│       ├── AmountInput.jsx         # Bet amount input
│       ├── PayoutDisplay.jsx       # Potential payout display
│       ├── PlaceBetButton.jsx      # Place bet button
│       ├── PhaseHandlers.jsx       # Confirming/Mining/Result phases
│       └── HashReveal.jsx          # Block hash display
│
├── constants/
│   ├── colors.js                   # Color palette
│   ├── fonts.js                    # Font family definitions
│   └── data.js                     # Navigation items, medals, steps, leaderboard
│
└── utils/
    └── helpers.js                  # Utility functions (hash, wallet, formatting)

DATA_FETCHING_GUIDE.md              # Complete data fetching architecture guide
```

## Key Improvements

✅ **Modular Components** - Each component has a single responsibility
✅ **Reusable Utilities** - Shared helpers for common operations
✅ **Centered Constants** - Easy theme and configuration changes
✅ **Composable Pages** - Complex pages built from smaller pieces
✅ **Clean Imports** - Organized directory structure
✅ **Scalable** - Easy to add new features or pages

## Component Hierarchy

```
App (Root)
├── Header
│   ├── GlowDot
│   └── Wallet Connection
├── Tab Content (based on selected tab)
│   ├── BetPage
│   │   ├── StatsRow
│   │   ├── ChoiceButtons
│   │   ├── AmountInput
│   │   ├── PayoutDisplay
│   │   ├── PlaceBetButton
│   │   ├── Phase Handlers (Confirming/Mining/Result)
│   │   └── HashReveal
│   ├── HistoryPage
│   │   └── GlowDot (multiple)
│   ├── LeaderboardPage
│   │   └── GlowDot
│   └── HowPage
└── BottomNav
    └── Navigation Items
```

## Usage Examples

### Import a component
```javascript
import { BetPage } from "./components/BetPage";
import { GlowDot } from "./components/GlowDot";
import { COLORS } from "./constants/colors";
import { simHash } from "./utils/helpers";
```

### Use constants across components
```javascript
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

<div style={{ background: COLORS.card, fontFamily: FONTS.mono }}>
  {/* Component content */}
</div>
```

### Create a custom hook for data fetching
```javascript
import { useState, useEffect } from "react";

function useBetHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/user/history
  }, []);

  return { history, loading };
}
```

## Next Steps

1. **Backend Integration** - Implement `/api/user/history` and `/api/leaderboard`
2. **Data Hooks** - Create `useBetHistory()` and `useLeaderboard()` hooks
3. **Authentication** - Integrate wallet auth with backend
4. **Live Updates** - Add WebSocket for real-time leaderboard
5. **Testing** - Unit tests for components and utilities
