import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function CTA({ setTab }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className="reveal cta-banner"
      style={{
        position: "relative",
        zIndex: 10,
        margin: "0 40px 80px",
        borderRadius: 20,
        overflow: "hidden",
        border: `0.5px solid rgba(0,255,135,0.2)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, rgba(0,255,135,0.08) 0%, rgba(0,201,106,0.04) 50%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,135,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,135,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "72px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: COLORS.text,
            lineHeight: 1.0,
            marginBottom: 20,
          }}
        >
          Ready to <span style={{ color: COLORS.green, textShadow: `0 0 40px rgba(0,255,135,0.5)` }}>call it?</span>
        </h2>
        <p
          style={{
            fontSize: 16,
            color: COLORS.mutedLight,
            fontWeight: 300,
            maxWidth: 480,
            margin: "0 auto 36px",
            lineHeight: 1.6,
          }}
        >
          Pick Big or Small. Let the blockchain decide. No house tricks, no delays.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setTab("bet")}
            style={{
              padding: "16px 36px",
              borderRadius: 10,
              background: COLORS.green,
              color: COLORS.bg,
              fontFamily: FONTS.display,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              border: "none",
              cursor: "pointer",
              boxShadow: `0 0 30px rgba(0,255,135,0.35)`,
              transition: "all 0.2s",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Place Your First Bet
          </button>
          <a
            href="https://celoscan.io"
            target="_blank"
            style={{
              padding: "15px 32px",
              borderRadius: 10,
              background: "transparent",
              color: COLORS.mutedLight,
              fontFamily: FONTS.mono,
              fontSize: 13,
              letterSpacing: "0.06em",
              border: `0.5px solid ${COLORS.border}`,
              cursor: "pointer",
              transition: "all 0.2s",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            View Contract ↗
          </a>
        </div>
      </div>
    </div>
  );
}