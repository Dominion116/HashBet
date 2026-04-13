import { useState } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

const isLocalDev = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const configuredApiBase = import.meta.env.VITE_API_BASE_URL;
const API_BASE = (
  isLocalDev
    ? ""
    : configuredApiBase && configuredApiBase.trim().length > 0
      ? configuredApiBase
      : "https://hashbet.onrender.com"
).replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE}${path}`;

/**
 * Component with refresh button for stats
 * Allows users to manually refresh their stats/history
 */
export function StatsRefreshButton({ authToken, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleRefresh() {
    if (!authToken) return;
    
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${authToken}` };
      
      const [historyRes, statsRes] = await Promise.all([
        fetch(apiUrl("/api/user/history?limit=20"), { headers }),
        fetch(apiUrl("/api/user/stats"), { headers }),
      ]);

      const historyData = historyRes.ok ? await historyRes.json() : null;
      const statsData = statsRes.ok ? await statsRes.json() : null;

      onRefresh?.({
        history: historyData?.success ? historyData.data : null,
        stats: statsData?.success ? statsData.data : null,
      });
    } catch (err) {
      console.error("Failed to refresh user data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={isLoading || !authToken}
      style={{
        padding: "4px 10px",
        borderRadius: 6,
        border: `0.5px solid ${COLORS.border}`,
        background: "transparent",
        color: isLoading ? COLORS.muted : COLORS.green,
        fontFamily: FONTS.mono,
        fontSize: 9,
        cursor: isLoading || !authToken ? "not-allowed" : "pointer",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        opacity: isLoading || !authToken ? 0.5 : 1,
        transition: "all .2s ease",
      }}
      title={authToken ? "Refresh stats and history" : "Authenticate wallet first"}
    >
      {isLoading ? "⟳" : "↻"} Refresh
    </button>
  );
}
