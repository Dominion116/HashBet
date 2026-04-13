import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function AmountInput({ amount, setAmount, phase, walletBalance }) {
  const minAmount = 0.02;
  const maxAmount = 0.1;
  const currentBalance = parseFloat(walletBalance) || 0;
  const isInsufficientForBet = currentBalance < minAmount;

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
        <span 
          style={{ 
            fontFamily: FONTS.mono, 
            fontSize: 10, 
            color: isInsufficientForBet ? COLORS.red : COLORS.mutedLight 
          }}
        >
          Balance: {walletBalance || "0.0000"} CELO
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
          disabled={phase !== "idle" || isInsufficientForBet}
          style={{
            background: COLORS.surface,
            border: `0.5px solid ${isInsufficientForBet ? COLORS.red : COLORS.border}`,
            borderRadius: 8,
            color: COLORS.text,
            fontFamily: FONTS.mono,
            fontSize: 18,
            fontWeight: 700,
            padding: "10px 50px 10px 14px",
            width: "100%",
            outline: "none",
            opacity: phase !== "idle" || isInsufficientForBet ? 0.6 : 1,
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
            pointerEvents: "none"
          }}
        >
          CELO
        </span>
      </div>

      {isInsufficientForBet && walletBalance && (
        <div
          style={{
            marginTop: 6,
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.red,
            textAlign: "right",
          }}
        >
          Insufficient balance. Minimum bet: 0.02 CELO
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
        {["0.02", "0.05", "0.08", "0.1"].map((v) => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            disabled={phase !== "idle" || isInsufficientForBet}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: `0.5px solid ${COLORS.border}`,
              background: "transparent",
              color: COLORS.muted,
              fontFamily: FONTS.mono,
              fontSize: 10,
              cursor: phase !== "idle" || isInsufficientForBet ? "not-allowed" : "pointer",
              letterSpacing: "0.08em",
              opacity: phase !== "idle" || isInsufficientForBet ? 0.5 : 1,
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
