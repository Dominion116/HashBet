import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { MEDALS, FAKE_LEADERBOARD } from "../constants/data";
import { GlowDot } from "./GlowDot";

export function LeaderboardPage({ leaderboard = [] }) {
  const rows = leaderboard.length > 0 ? leaderboard : FAKE_LEADERBOARD;

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
        <GlowDot pulse size={7} />
      </div>

      {rows.map((p, i) => (
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
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.mutedLight, flex: 1 }}>
            {p.addr}
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted, minWidth: 40 }}>
            {p.wins}W
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: COLORS.green }}>
            {p.net} CELO
          </div>
        </div>
      ))}
    </div>
  );
}
