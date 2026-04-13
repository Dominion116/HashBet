import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import { GlowDot } from "./GlowDot";

const CONTRACT_ABI = [
  "function totalPool() view returns (uint256)",
];

/**
 * Component to display contract pool status
 * Shows if pool has sufficient liquidity for betting
 */
export function PoolStatus({ walletProvider, contractConfig }) {
  const [poolBalance, setPoolBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletProvider || !contractConfig?.contractAddress) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchPoolBalance() {
      try {
        const provider = new BrowserProvider(walletProvider);
        const contract = new Contract(
          contractConfig.contractAddress,
          CONTRACT_ABI,
          provider
        );
        const poolWei = await contract.totalPool();
        
        if (isMounted) {
          const poolCelo = formatEther(poolWei);
          setPoolBalance(Number(poolCelo).toFixed(4));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn("Failed to fetch pool balance:", err);
          setError(err.message || "Failed to fetch pool");
          setLoading(false);
        }
      }
    }

    // Fetch immediately
    fetchPoolBalance();

    // Refresh every 5 seconds
    const interval = setInterval(fetchPoolBalance, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [walletProvider, contractConfig?.contractAddress]);

  const poolLow = poolBalance && parseFloat(poolBalance) < 1;

  return (
    <div
      style={{
        padding: "12px 14px",
        background: COLORS.card,
        border: `0.5px solid ${poolLow ? "rgba(255,77,106,0.3)" : COLORS.border}`,
        borderRadius: 10,
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <GlowDot color={poolLow ? "#FF4D6A" : COLORS.green} size={6} />
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: COLORS.mutedLight,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Pool Status
        </span>
      </div>
      <span
        style={{
          fontFamily: FONTS.mono,
          fontSize: 12,
          fontWeight: 600,
          color: poolLow ? "#FF4D6A" : COLORS.green,
        }}
      >
        {loading ? "..." : (poolBalance ? `${poolBalance} CELO` : "—")}
      </span>
      {poolLow && (
        <span
          style={{
            fontFamily: FONTS.mono,
            fontSize: 8,
            color: "#FF4D6A",
            marginLeft: "auto",
            marginRight: 0,
          }}
        >
          LOW
        </span>
      )}
    </div>
  );
}
