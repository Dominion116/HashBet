import { COLORS } from "../constants/colors";

export function GlowDot({ color = COLORS.green, size = 6, pulse = false }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${size * 1.5}px ${color}`,
        flexShrink: 0,
        animation: pulse ? "pulse 1.8s ease-in-out infinite" : "none",
      }}
    />
  );
}
