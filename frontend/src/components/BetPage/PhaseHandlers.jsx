import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function ConfirmingPhase() {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: FONTS.mono,
        fontSize: 12,
        color: COLORS.mutedLight,
        padding: "14px 0",
        animation: "fadeIn .3s ease",
      }}
    >
      Awaiting wallet confirmation…
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 6 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: COLORS.green,
              display: "inline-block",
              animation: `pulse 1s ease ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function MiningPhase({ miningProg }) {
  return (
    <div style={{ animation: "fadeIn .3s ease" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: COLORS.mutedLight,
          marginBottom: 6,
        }}
      >
        <span>Mining target block…</span>
        <span>{Math.round(miningProg)}%</span>
      </div>
      <div
        style={{ height: 3, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}
      >
        <div
          style={{
            height: "100%",
            width: `${miningProg}%`,
            background: COLORS.green,
            borderRadius: 4,
            transition: "width .18s ease",
          }}
        />
      </div>
    </div>
  );
}

export function ResultPhase({ lastResult, payout, amount, onReset }) {
  return (
    <div style={{ animation: "resultPop .4s cubic-bezier(.34,1.56,.64,1)" }}>
      <div
        style={{
          textAlign: "center",
          padding: "18px 0 12px",
          borderRadius: 10,
          background: lastResult === "win" ? COLORS.greenGhost : COLORS.redGhost,
          border: `1px solid ${
            lastResult === "win" ? "rgba(0,255,135,.25)" : "rgba(255,77,106,.25)"
          }`,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 28,
            fontWeight: 800,
            color: lastResult === "win" ? COLORS.green : COLORS.red,
            letterSpacing: "0.04em",
          }}
        >
          {lastResult === "win" ? "YOU WIN" : "YOU LOSE"}
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 13,
            color: lastResult === "win" ? COLORS.green : COLORS.red,
            marginTop: 4,
          }}
        >
          {lastResult === "win" ? `+${payout}` : `-${amount.toFixed(3)}`} CELO
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: `0.5px solid ${COLORS.border}`,
          background: COLORS.card,
          color: COLORS.text,
          fontFamily: FONTS.display,
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        Bet Again
      </button>
    </div>
  );
}
