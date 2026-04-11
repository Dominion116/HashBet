import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { GlowDot } from "./GlowDot";

export function Header({ block, walletConnected, walletAddr, onConnect }) {
  return (
    <header
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        background: `${COLORS.surface}CC`,
        backdropFilter: "blur(12px)",
        borderBottom: `0.5px solid ${COLORS.border}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: COLORS.green,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONTS.display,
            fontWeight: 800,
            fontSize: 15,
            color: COLORS.bg,
          }}
        >
          #
        </div>
        <div>
          <div style={{ fontFamily: FONTS.display, fontSize: 16, fontWeight: 800, color: COLORS.text }}>
            HASHBET
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: COLORS.muted, letterSpacing: "0.1em" }}>
            ON CELO BLOCKCHAIN
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Block ticker */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: FONTS.mono, fontSize: 11, color: COLORS.mutedLight }}>
          <GlowDot size={6} pulse />
          <span>Block</span>
          <span style={{ color: COLORS.green, fontWeight: 700 }}>#{block.toLocaleString()}</span>
        </div>

        {walletConnected ? (
          <div
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              border: `0.5px solid ${COLORS.border}`,
              background: COLORS.card,
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.mutedLight,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <GlowDot size={5} />
            {walletAddr}
          </div>
        ) : (
          <button
            onClick={onConnect}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: `0.5px solid ${COLORS.green}`,
              background: COLORS.greenGhost,
              color: COLORS.green,
              fontFamily: FONTS.mono,
              fontSize: 11,
              cursor: "pointer",
              letterSpacing: "0.06em",
            }}
          >
            Connect
          </button>
        )}
      </div>
    </header>
  );
}
