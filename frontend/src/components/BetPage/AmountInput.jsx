import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function AmountInput({ amount, setAmount, phase }) {
  const minAmount = 0.02;
  const maxAmount = 0.1;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.muted,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          Bet Amount
        </span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.mutedLight }}>
          Balance: 42.00 CELO
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type="number"
          value={amount}
          min={minAmount}
          max={maxAmount}
          step="0.01"
          onChange={(e) => setAmount(e.target.value)}
          disabled={phase !== "idle"}
          style={{
            background: COLORS.surface,
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 8,
            color: COLORS.text,
            fontFamily: FONTS.mono,
            fontSize: 18,
            fontWeight: 700,
            padding: "10px 50px 10px 14px",
            width: "100%",
            outline: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.muted,
          }}
        >
          CELO
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {["0.02", "0.05", "0.08", "0.1"].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            disabled={phase !== "idle"}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: `0.5px solid ${COLORS.border}`,
              background: "transparent",
              color: COLORS.muted,
              fontFamily: FONTS.mono,
              fontSize: 10,
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
