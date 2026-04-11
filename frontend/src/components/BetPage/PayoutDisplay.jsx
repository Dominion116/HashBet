import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function PayoutDisplay({ payout }) {
  return (
    <div
      style={{
        background: COLORS.surface,
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted }}>
        Potential win
      </span>
      <span style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: COLORS.green }}>
        {payout} CELO
      </span>
    </div>
  );
}
