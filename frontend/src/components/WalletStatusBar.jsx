import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { GlowDot } from "./GlowDot";

/**
 * Component to show wallet and contract status info
 * Displays balance, gas considerations, and warnings
 */
export function WalletStatusBar({ walletBalance }) {
  const balanceNum = parseFloat(walletBalance) || 0;
  const isLowBalance = balanceNum < 0.05 && balanceNum > 0;
  const noBalance = balanceNum === 0;

  return (
    <div
      style={{
        padding: "10px 14px",
        background: noBalance ? "rgba(255,77,106,0.05)" : isLowBalance ? "rgba(255,184,48,0.05)" : "rgba(0,255,135,0.03)",
        border: `0.5px solid ${noBalance ? "rgba(255,77,106,0.2)" : isLowBalance ? "rgba(255,184,48,0.2)" : "rgba(0,255,135,0.2)"}`,
        borderRadius: 8,
        marginBottom: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <GlowDot 
          color={noBalance ? "#FF4D6A" : isLowBalance ? COLORS.amber : COLORS.green} 
          size={5} 
        />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.muted,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {noBalance ? "Balance Critical" : isLowBalance ? "Balance Low" : "Status Good"}
        </span>
      </div>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          fontWeight: 600,
          color: noBalance ? "#FF4D6A" : isLowBalance ? COLORS.amber : COLORS.green,
        }}
      >
        {walletBalance || "0.0000"} CELO
      </span>
    </div>
  );
}
