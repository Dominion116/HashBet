import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";

/**
 * Hook to fetch and track current block number from the blockchain
 * @param {Object} walletProvider - EIP1193 provider from Reown AppKit
 * @param {number} pollInterval - Poll interval in milliseconds (default 5000)
 * @returns {Object} { blockNumber, loading, error }
 */
export function useBlockNumber(walletProvider, pollInterval = 5000) {
  const [blockNumber, setBlockNumber] = useState(28_447_201);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletProvider) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchBlockNumber() {
      try {
        const provider = new BrowserProvider(walletProvider);
        const blockNum = await provider.getBlockNumber();
        
        if (isMounted) {
          setBlockNumber(blockNum);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch block number:", err);
          setError(err.message || "Failed to fetch block number");
          setLoading(false);
        }
      }
    }

    // Fetch immediately
    fetchBlockNumber();

    // Set up polling interval
    const interval = setInterval(fetchBlockNumber, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [walletProvider, pollInterval]);

  return { blockNumber, loading, error };
}
