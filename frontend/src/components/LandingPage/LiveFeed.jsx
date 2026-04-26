import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function LiveFeed() {
  const ref = useReveal();
  const [bets, setBets] = useState([]);

  useEffect(() => {
    // Mock live bets
    const generateBet = () => {
      const choices = ['BIG', 'SMALL'];
      const amounts = [0.5, 1, 2, 5, 10];
      const hexChars = '0123456789ABCDEF';
      const first = hexChars[Math.floor(Math.random() * 16)];
      const isBig = parseInt(first, 16) >= 8;
      const choice = choices[Math.floor(Math.random() * 2)];
      const won = (choice === 'BIG') === isBig;
      const amt = amounts[Math.floor(Math.random() * amounts.length)];
      const payout = won ? (amt * 1.88).toFixed(3) : (-amt).toFixed(3);
      return {
        block: Math.floor(Math.random() * 1000000) + 28447200,
        hash: first + Array.from({ length: 14 }, () => hexChars[Math.floor(Math.random() * 16)]).join(''),
        choice,
        amount: amt,
        result: payout,
        win: won,
      };
    };

    setBets(Array.from({ length: 8 }, generateBet));

    const interval = setInterval(() => {
      setBets((prev) => [generateBet(), ...prev.slice(0, 11)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={ref}
      id="live"
      className="reveal"
      style={{
        background: COLORS.surface,
        borderTop: `0.5px solid ${COLORS.border}`,
        borderBottom: `0.5px solid ${COLORS.border}`,
        padding: "100px 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.green,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div style={{ width: 28, height: 1, background: COLORS.green }} />
              Real-Time
            </div>
            <h2
              style={{
                fontFamily: FONTS.display,
                fontSize: "clamp(32px, 5vw, 54px)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: COLORS.text,
              }}
            >
              Live Bet Feed
            </h2>
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: COLORS.mutedLight,
            }}
          >
            Updating every ~5s
          </div>
        </div>

        <div
          style={{
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 20px",
              background: COLORS.card,
              borderBottom: `0.5px solid ${COLORS.border}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: COLORS.mutedLight,
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: COLORS.green,
                  boxShadow: `0 0 8px ${COLORS.green}`,
                  animation: "pulse 1.8s ease infinite",
                }}
              />
              <span>Live on Celo Mainnet</span>
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.muted,
              }}
            >
              Pool: <span style={{ color: COLORS.green }}>8,420.5 cUSD</span>
            </div>
          </div>

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 80px 100px 90px",
              alignItems: "center",
              gap: 16,
              padding: "10px 20px",
              borderBottom: `0.5px solid ${COLORS.border}`,
              fontFamily: FONTS.mono,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: COLORS.muted,
            }}
          >
            <span>Block</span>
            <span>Hash</span>
            <span>Choice</span>
            <span>Amount</span>
            <span>Result</span>
          </div>

          {/* Bets */}
          <div id="live-rows">
            {bets.map((bet, i) => (
              <div
                key={i}
                className="live-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 2fr 80px 100px 90px",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 20px",
                  borderBottom: i < bets.length - 1 ? `0.5px solid ${COLORS.border}` : "none",
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  transition: "background 0.15s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.target.style.background = COLORS.card)}
                onMouseLeave={(e) => (e.target.style.background = "transparent")}
              >
                <span style={{ color: COLORS.mutedLight }}>…{bet.block}</span>
                <span style={{ color: COLORS.mutedLight, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <span style={{ color: COLORS.green, fontWeight: 700 }}>{bet.hash[0]}</span>
                  {bet.hash.slice(1, 15)}…
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: bet.choice === 'BIG' ? `rgba(255,184,48,0.12)` : `rgba(96,169,255,0.1)`,
                    color: bet.choice === 'BIG' ? COLORS.amber : COLORS.blue,
                  }}
                >
                  {bet.choice}
                </span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.mutedLight }}>
                  {bet.amount} cUSD
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: bet.win ? COLORS.green : COLORS.red,
                    textShadow: bet.win ? `0 0 8px rgba(0,255,135,0.4)` : "none",
                  }}
                >
                  {bet.win ? '+' : ''}{bet.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}