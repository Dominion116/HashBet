import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { GlowDot } from "./GlowDot";

/**
 * Component to display contract pool status.
 * Data is provided by parent to keep all pages in sync.
 */
export function PoolStatus({ poolBalance, loading = false, error = null }) {

  const poolLow = poolBalance && parseFloat(poolBalance) < 1;

  return (
    <div
      style={{
        padding: "12px 14px",
        background: COLORS.card,
        border: `0.5px solid ${poolLow ? "rgba(255,77,106,0.3)" : COLORS.border}`,
        borderRadius: 10,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <GlowDot color={poolLow ? "#FF4D6A" : COLORS.green} size={6} />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: COLORS.mutedLight,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Pool Status
        </span>
      </div>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          fontWeight: 600,
          color: poolLow ? "#FF4D6A" : COLORS.green,
        }}
      >
        {loading ? "..." : error ? "—" : poolBalance ? `${poolBalance} CELO` : "—"}
      </span>
      {poolLow && (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 8,
            color: "#FF4D6A",
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          LOW
        </span>
      )}
    </div>
  );
}
