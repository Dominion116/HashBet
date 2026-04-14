import { useState, useEffect } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, formatEther } from "ethers";

const CONTRACT_ABI = ["function totalPool() view returns (uint256)"];

/**
 * Hook to fetch and track contract pool balance.
 * Falls back to wallet provider when no public RPC URL is configured.
 */
export function usePoolBalance(walletProvider, contractConfig, refreshInterval = 5000) {
  const [poolBalance, setPoolBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const contractAddress = contractConfig?.contractAddress;
    const rpcUrl = contractConfig?.rpcUrl;

    if (!contractAddress) {
      setPoolBalance(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (!rpcUrl && !walletProvider) {
      setPoolBalance(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    async function fetchPool() {
      try {
        const provider = rpcUrl ? new JsonRpcProvider(rpcUrl) : new BrowserProvider(walletProvider);
        const contract = new Contract(contractAddress, CONTRACT_ABI, provider);
        const poolWei = await contract.totalPool();

        if (isMounted) {
          setPoolBalance(Number(formatEther(poolWei)).toFixed(4));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch pool");
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
  }, [walletProvider, contractConfig?.contractAddress, contractConfig?.rpcUrl, refreshInterval]);

  return { poolBalance, loading, error };
}
