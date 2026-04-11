import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { NAV_ITEMS } from "../constants/data";

export function BottomNav({ tab, onTabChange }) {
  const tabIdx = NAV_ITEMS.findIndex((n) => n.id === tab);

  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: COLORS.surface,
        borderTop: `0.5px solid ${COLORS.border}`,
        display: "flex",
        zIndex: 20,
      }}
    >
      {/* Active indicator bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${tabIdx * 25}%`,
          width: "25%",
          height: 2,
          background: COLORS.green,
          boxShadow: `0 0 8px ${COLORS.green}`,
          borderRadius: "0 0 2px 2px",
          transition: "left .25s cubic-bezier(.4,0,.2,1)",
        }}
      />

      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "all .15s",
          }}
        >
          <span
            style={{
              fontSize: 18,
              lineHeight: 1,
              transform: tab === item.id ? "scale(1.1)" : "scale(1)",
              transition: "transform .15s",
            }}
          >
            {item.icon}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: tab === item.id ? COLORS.green : COLORS.muted,
              transition: "color .15s",
            }}
          >
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
