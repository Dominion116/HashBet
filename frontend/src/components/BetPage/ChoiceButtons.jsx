import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function ChoiceButtons({ choice, setChoice, phase }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {["Big", "Small"].map((c) => (
        <button
          key={c}
          disabled={phase !== "idle"}
          onClick={() => setChoice(c)}
          style={{
            flex: 1,
            padding: "14px 0",
            borderRadius: 10,
            border: `1.5px solid ${
              choice === c
                ? c === "Big"
                  ? COLORS.amber
                  : "#60A9FF"
                : COLORS.border
            }`,
            cursor: phase !== "idle" ? "not-allowed" : "pointer",
            fontFamily: FONTS.display,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.06em",
            background:
              choice === c
                ? c === "Big"
                  ? "rgba(255,184,48,0.1)"
                  : "rgba(96,169,255,0.1)"
                : COLORS.card,
            color: c === "Big" ? COLORS.amber : "#60A9FF",
            textAlign: "center",
            boxShadow:
              choice === c
                ? c === "Big"
                  ? "0 0 20px rgba(255,184,48,0.15)"
                  : "0 0 20px rgba(96,169,255,0.15)"
                : "none",
            transition: "all 0.18s",
            opacity: phase !== "idle" ? 0.6 : 1,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: FONTS.mono,
              letterSpacing: "0.1em",
              opacity: 0.7,
              marginBottom: 3,
            }}
          >
            {c === "Big" ? "8 → F" : "0 → 7"}
          </div>
          {c.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
