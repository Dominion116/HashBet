import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { calculateWinRate } from "../utils/helpers";

export function StatsRow({ stats, total, tokenSymbol = "cUSD" }) {
  return (
    <div style={{ display: "flex", gap: 8, padding: "14px 14px 0" }}>
      {[
        { label: "Total", value: total, color: COLORS.text },
        {
          label: "Wins",
          value: stats.wins,
          color: COLORS.green,
          sub: `${calculateWinRate(stats.wins, total)}% rate`,
        },
        {
          label: "Net P&L",
          value: `${stats.net >= 0 ? "+" : ""}${stats.net}`,
          color: stats.net >= 0 ? COLORS.green : COLORS.red,
          sub: tokenSymbol,
        },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            flex: 1,
            background: COLORS.card,
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: COLORS.muted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 4,
            }}
          >
            {s.label}
          </div>
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 18,
              fontWeight: 800,
              color: s.color,
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          {s.sub && (
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 10,
                color: COLORS.muted,
                marginTop: 2,
              }}
            >
              {s.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
