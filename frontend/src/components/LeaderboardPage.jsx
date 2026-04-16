import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { MEDALS } from "../constants/data";
import { GlowDot } from "./GlowDot";

function truncateAddress(address) {
  if (!address) return "—";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function LeaderboardPage({ leaderboard = [], onRefreshLeaderboard, tokenSymbol = "cUSD" }) {
  const rows = leaderboard;

  return (
    <div style={{ padding: "14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 800, color: COLORS.text }}>
            Leaderboard
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
            TOP PLAYERS THIS WEEK
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GlowDot pulse size={7} />
          <button
            onClick={onRefreshLeaderboard}
            disabled={!onRefreshLeaderboard}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: `0.5px solid ${COLORS.border}`,
              background: "transparent",
              color: COLORS.green,
              fontFamily: FONTS.mono,
              fontSize: 9,
              cursor: onRefreshLeaderboard ? "pointer" : "not-allowed",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: onRefreshLeaderboard ? 1 : 0.5,
              transition: "all .2s ease",
            }}
            title="Refresh leaderboard"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 12,
            color: COLORS.muted,
            textAlign: "center",
            padding: "32px 0",
          }}
        >
          No leaderboard data yet
        </div>
      ) : rows.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background:
              i === 0
                ? "rgba(255,184,48,0.05)"
                : i === 1
                ? "rgba(200,200,200,0.03)"
                : i === 2
                ? "rgba(205,127,50,0.04)"
                : COLORS.card,
            border: `0.5px solid ${
              i === 0 ? "rgba(255,184,48,0.35)" : i < 3 ? "rgba(200,200,200,0.15)" : COLORS.border
            }`,
            borderRadius: 10,
            padding: "10px 12px",
            marginBottom: 8,
          }}
        >
          <div style={{ fontFamily: FONTS.display, fontSize: 15, fontWeight: 800, minWidth: 22 }}>
            {i < 3 ? MEDALS[i] : i + 1}
          </div>
          <div
            title={p.addr}
            style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.mutedLight, flex: 1 }}
          >
            {truncateAddress(p.addr)}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted, minWidth: 40 }}>
            {p.wins}W
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              fontWeight: 700,
              color: String(p.net).trim().startsWith("-") ? COLORS.red : COLORS.green,
            }}
          >
            {p.net} {tokenSymbol}
          </div>
        </div>
      ))}
    </div>
  );
}
