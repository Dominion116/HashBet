import { useState, useEffect } from "react";
import { apiUrl } from "../utils/api";

/**
 * Hook to fetch and track contract pool balance from the public backend state endpoint.
 */
export function usePoolBalance(refreshInterval = 5000) {
  const [poolBalance, setPoolBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPool() {
      try {
        const response = await fetch(apiUrl("/api/contract/state"));

        if (!response.ok) {
          throw new Error(`Failed to fetch pool state (${response.status})`);
        }

        const payload = await response.json();

        if (!payload.success) {
          throw new Error(payload.error || "Failed to fetch pool state");
        }

        if (isMounted) {
          setPoolBalance(Number.parseFloat(payload.data.totalPool || 0).toFixed(4));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch pool");
          setPoolBalance(null);
          setLoading(false);
        }
      }
    }

    fetchPool();
    const interval = setInterval(fetchPool, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshInterval]);

  return { poolBalance, loading, error };
}
