import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { GlowDot } from "../GlowDot";

export function HashReveal({ lastHash, phase }) {
  return (
    <div style={{ padding: "14px" }}>
      <div
        style={{
          background: COLORS.card,
          border: `0.5px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <GlowDot size={5} pulse={phase === "mining"} />
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: COLORS.muted,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Block Hash Result
          </span>
        </div>

        {lastHash ? (
          <>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.mutedLight,
                wordBreak: "break-all",
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: COLORS.green, fontSize: 13, fontWeight: 700 }}>
                {lastHash[0]}
              </span>
              {lastHash.slice(1)}
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "6px 10px",
                background: COLORS.surface,
                borderRadius: 6,
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: COLORS.mutedLight,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                First char:{" "}
                <span style={{ color: COLORS.green, fontWeight: 700 }}>{lastHash[0]}</span>
              </span>
              <span>
                {parseInt(lastHash[0], 16) >= 8 ? (
                  <span style={{ color: COLORS.amber }}>BIG (8–F)</span>
                ) : (
                  <span style={{ color: "#60A9FF" }}>SMALL (0–7)</span>
                )}
              </span>
            </div>
          </>
        ) : (
          <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.muted }}>
            {phase === "mining" ? "Mining block…" : "Place a bet to reveal the block hash"}
          </div>
        )}
      </div>
    </div>
  );
}
