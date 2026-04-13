import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { StatsRefreshButton } from "./StatsRefreshButton";
import { GlowDot } from "./GlowDot";

export function HistoryPage({ history, authToken, onRefresh }) {
  return (
    <div style={{ padding: "14px" }}>
      <div 
        style={{
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 800, color: COLORS.text }}>
            Bet History
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: COLORS.muted,
              marginTop: 2,
              letterSpacing: "0.1em",
            }}
          >
            YOUR LAST 20 ROUNDS
          </div>
        </div>
        <StatsRefreshButton authToken={authToken} onRefresh={onRefresh} />
      </div>

      {history.length === 0 ? (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: COLORS.muted,
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          No bets yet
        </div>
      ) : (
        history.map((bet, i) => {
          const won = bet.result === "win";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 0",
                borderBottom: `0.5px solid ${COLORS.border}`,
                animation: i === 0 ? "slideIn .3s ease" : "none",
              }}
            >
              <GlowDot color={won ? COLORS.green : COLORS.red} size={6} />
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted, minWidth: 56 }}>
                Bet #{history.length - i}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: COLORS.mutedLight,
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bet.hash.slice(0, 14)}…
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: bet.choice === "Big" ? COLORS.amber : "#60A9FF",
                  minWidth: 34,
                }}
              >
                {bet.choice}
              </span>
              <span
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  fontWeight: 700,
                  color: won ? COLORS.green : COLORS.red,
                  minWidth: 70,
                  textAlign: "right",
                }}
              >
                {won ? `+${bet.payout.toFixed(3)}` : `-${bet.amount.toFixed(3)}`}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
