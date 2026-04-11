import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export function PlaceBetButton({ walletConnected, phase, choice, amt, isValidAmount, onConnect, onPlaceBet }) {
  if (phase !== "idle") return null;

  const canBet = Boolean(choice) && isValidAmount;

  return (
    <button
      onClick={walletConnected ? onPlaceBet : onConnect}
      disabled={!canBet}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: 10,
        border: "none",
        cursor: canBet ? "pointer" : "not-allowed",
        fontFamily: FONTS.display,
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        background: canBet ? COLORS.green : COLORS.border,
        color: canBet ? COLORS.bg : COLORS.muted,
        transition: "all 0.2s",
      }}
    >
      {walletConnected ? "Place Bet" : "Connect to Bet"}
    </button>
  );
}
