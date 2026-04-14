import { useState, useEffect } from "react";
import { apiUrl } from "../utils/api";

export function useBetHistory(limit = 20) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        const res = await fetch(apiUrl(`/api/user/history?limit=${limit}`), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch history");
        
        const data = await res.json();
        if (data.success) {
          setHistory(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit]);

  return { history, loading, error };
}

export function useLeaderboard(period = "week", limit = 50) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(apiUrl(`/api/leaderboard?period=${period}&limit=${limit}`));

        if (!res.ok) throw new Error("Failed to fetch leaderboard");
        
        const data = await res.json();
        if (data.success) {
          setLeaderboard(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [period, limit]);

  return { leaderboard, loading, error };
}

export function useUserStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        
        const res = await fetch(apiUrl("/api/user/stats"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch stats");
        
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Refresh every minute
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error };
}
