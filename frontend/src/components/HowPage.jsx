import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { STEPS } from "../constants/data";

function formatContractAddress(address) {
  if (!address) return "—";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function getChainLabel(chainId) {
  if (chainId === 11142220) return "Celo Sepolia";
  if (chainId === 42220) return "Celo Mainnet";
  return "Celo";
}

export function HowPage({ contractAddress, chainId, poolBalance, poolLoading, poolError, tokenSymbol = "USDC" }) {
  const statsGrid = [
    { label: "Win multiplier", value: "1.88×", color: COLORS.green },
    { label: "House edge", value: "6%", color: COLORS.amber },
    { label: "Win probability", value: "50%", color: COLORS.mutedLight },
    { label: "Settlement", value: "On-chain", color: COLORS.mutedLight },
  ];

  return (
    <div style={{ padding: "14px" }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 18, fontWeight: 800, color: COLORS.text }}>
          How it works
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.muted,
            marginTop: 2,
            letterSpacing: "0.1em",
          }}
        >
          PROVABLY FAIR ONCHAIN
        </div>
      </div>

      {/* Steps */}
      <div
        style={{
          background: COLORS.card,
          border: `0.5px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
        }}
      >
        {STEPS.map((s) => (
          <div
            key={s.n}
            style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}
          >
            <span
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.green,
                fontWeight: 700,
                minWidth: 22,
                paddingTop: 1,
              }}
            >
              {s.n}
            </span>
            <div>
              <div style={{ fontFamily: FONTS.body, fontSize: 13, fontWeight: 500, color: COLORS.text }}>
                {s.label}
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: COLORS.muted, marginTop: 2 }}>
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        {statsGrid.map((item) => (
          <div
            key={item.label}
            style={{
              background: COLORS.surface,
              border: `0.5px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 9,
                color: COLORS.muted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 4,
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: 20,
                fontWeight: 800,
                color: item.color,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Contract bar */}
      <div
        style={{
          background: COLORS.card,
          border: `0.5px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: COLORS.muted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Smart Contract
          </div>
          <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.mutedLight, marginTop: 2 }}>
            {`${formatContractAddress(contractAddress)} · ${getChainLabel(chainId)}`}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 9,
              color: COLORS.muted,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Pool
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 12,
              color: COLORS.green,
              fontWeight: 700,
              marginTop: 2,
            }}
          >
            {poolLoading ? "..." : poolError ? "—" : poolBalance ? `${poolBalance} ${tokenSymbol}` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
