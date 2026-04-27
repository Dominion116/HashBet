import { COLORS } from "../../constants/colors";

export default function BackgroundEffects() {
  return (
    <>
      {/* Grid BG */}
      {/* Grid BG - simplified for Safari compatibility */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(${COLORS.border}22 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.border}22 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
          opacity: 0.5,
        }}
      />
      {/* Scanline - simplified */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />
      {/* Scanline */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: `repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
          )`,
        }}
      />
    </>
  );
}