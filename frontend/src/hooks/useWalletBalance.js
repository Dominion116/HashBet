import { useState, useEffect } from "react";
import { BrowserProvider, Contract, formatEther } from "ethers";

const ERC20_ABI = ["function balanceOf(address) view returns (uint256)"];

/**
 * Hook to fetch and track wallet balance
 * @param {Object} walletProvider - EIP1193 provider from Reown AppKit
 * @param {string} address - User's wallet address
 * @param {string} tokenAddress - Optional ERC20 token address to read instead of native balance
 * @param {number} refreshInterval - Refresh interval in milliseconds (default 5000)
 * @returns {Object} { balance, balanceWei, loading, error }
 */
export function useWalletBalance(walletProvider, address, tokenAddress, refreshInterval = 5000) {
  const [balance, setBalance] = useState("0.0000");
  const [balanceWei, setBalanceWei] = useState(0n);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletProvider || !address) {
      setLoading(false);
      setBalance("0.0000");
      setBalanceWei(0n);
      return;
    }

    let isMounted = true;

    async function fetchBalance() {
      try {
        const provider = new BrowserProvider(walletProvider);
        const balanceWei = tokenAddress
          ? await new Contract(tokenAddress, ERC20_ABI, provider).balanceOf(address)
          : await provider.getBalance(address);
        
        if (isMounted) {
          setBalanceWei(balanceWei);
          const balanceCelo = formatEther(balanceWei);
          setBalance(Number(balanceCelo).toFixed(4));
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch wallet balance:", err);
          setError(err.message || "Failed to fetch balance");
          setBalance("0.0000");
          setBalanceWei(0n);
          setLoading(false);
        }
      }
    }

    // Fetch immediately
    fetchBalance();

    // Set up refresh interval
    const interval = setInterval(fetchBalance, refreshInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [walletProvider, address, tokenAddress, refreshInterval]);

  return { balance, balanceWei, loading, error };
}
