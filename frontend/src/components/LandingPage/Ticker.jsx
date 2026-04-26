import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { apiUrl } from "../../utils/api";

export default function Ticker() {
  const [bets, setBets] = useState([]);

  useEffect(() => {
    // Fetch recent bets for ticker
    // For now, use mock data
    const mockBets = [
      { block: 28447198, choice: 'BIG', result: '+2.820', win: true },
      { block: 28447195, choice: 'SMALL', result: '-1.500', win: false },
      { block: 28447192, choice: 'BIG', result: '+5.640', win: true },
      { block: 28447189, choice: 'SMALL', result: '+0.940', win: true },
      { block: 28447186, choice: 'BIG', result: '-3.000', win: false },
      { block: 28447183, choice: 'SMALL', result: '+9.400', win: true },
      { block: 28447180, choice: 'BIG', result: '-2.000', win: false },
      { block: 28447177, choice: 'SMALL', result: '+1.880', win: true },
    ];
    setBets(mockBets);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 71,
        left: 0,
        right: 0,
        zIndex: 99,
        background: COLORS.surface,
        borderBottom: `0.5px solid ${COLORS.border}`,
        padding: "6px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 0,
          animation: "ticker 28s linear infinite",
          whiteSpace: "nowrap",
        }}
      >
        {[...bets, ...bets].map((bet, i) => (
          <div
            key={i}
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              color: bet.win ? COLORS.green : COLORS.red,
              padding: "0 32px",
              letterSpacing: "0.08em",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Block #{bet.block} · {bet.choice} · <span>{bet.result} cUSD</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}