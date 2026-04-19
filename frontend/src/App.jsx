import { useState, useEffect, useRef } from "react";
import { BrowserProvider } from "ethers";
import { useAppKit, useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { COLORS } from "./constants/colors";
import { FONTS } from "./constants/fonts";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { BetPage } from "./components/BetPage";
import { HistoryPage } from "./components/HistoryPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { HowPage } from "./components/HowPage";
import { useWalletBalance } from "./hooks/useWalletBalance";
import { useBlockNumber } from "./hooks/useBlockNumber";
import { usePoolBalance } from "./hooks/usePoolBalance";
import { apiUrl } from "./utils/api";

const LOCAL_BET_CACHE_KEY = "hashbet:settledBets";
const DEFAULT_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const DEFAULT_CHAIN_ID = Number(import.meta.env.VITE_CELO_CHAIN_ID || 42220);

function readLocalBetCache() {
  try {
    const raw = localStorage.getItem(LOCAL_BET_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mergeBetLists(primary = [], secondary = []) {
  const seen = new Set();
  const merged = [];

  for (const bet of [...primary, ...secondary]) {
    const key = String(bet?.hash || bet?.id || `${bet?.timestamp || ""}:${bet?.blockNumber || ""}`);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(bet);
  }

  return merged;
}

function calculateStatsFromHistory(history = []) {
  const wins = history.filter((entry) => entry.result === "win").length;
  const losses = history.filter((entry) => entry.result === "lose").length;
  const net = history.reduce((total, entry) => {
    const amount = Number.parseFloat(entry.amount) || 0;
    const payout = Number.parseFloat(entry.payout) || 0;
    return total + (entry.result === "win" ? payout - amount : -amount);
  }, 0);

  return {
    wins,
    losses,
    net: Number.parseFloat(net.toFixed(4)),
  };
}

export default function HashBetMini() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount({ namespace: "eip155" });
  const { walletProvider } = useAppKitProvider("eip155");
  const [miniPayAddress, setMiniPayAddress] = useState("");
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [tab, setTab] = useState("bet");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [contractConfig, setContractConfig] = useState({
    chainId: DEFAULT_CHAIN_ID,
    contractAddress: DEFAULT_CONTRACT_ADDRESS,
    rpcUrl: "",
    paymentTokenAddress: "",
    paymentTokenSymbol: "USDC",
    paymentTokenDecimals: 6,
  });
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, net: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const authenticatedAddressRef = useRef(localStorage.getItem("authAddress") || "");

  const effectiveWalletProvider = walletProvider || (isMiniPay ? window.ethereum : null);
  const walletAddr = address || miniPayAddress || "";
  const walletConnected = Boolean((isConnected && address) || (isMiniPay && walletAddr));

  // Use real block number from blockchain
  const { blockNumber: block } = useBlockNumber(effectiveWalletProvider, 5000);

  // Use real wallet balance
  const { balance: walletBalance } = useWalletBalance(
    effectiveWalletProvider,
    walletAddr,
    contractConfig.paymentTokenAddress,
    contractConfig.paymentTokenDecimals,
    5000
  );
  const { poolBalance, loading: poolLoading, error: poolError } = usePoolBalance(5000);

  useEffect(() => {
    let cancelled = false;

    async function setupMiniPay() {
      if (typeof window === "undefined") return;

      const injected = window.ethereum;
      if (!injected?.isMiniPay) return;

      setIsMiniPay(true);

      try {
        let accounts = await injected.request({ method: "eth_accounts" });
        if (!accounts?.length) {
          accounts = await injected.request({ method: "eth_requestAccounts" });
        }

        if (!cancelled && accounts?.[0]) {
          setMiniPayAddress(String(accounts[0]));
        }
      } catch (err) {
        console.warn("MiniPay account access failed", err);
      }
    }

    setupMiniPay();

    return () => {
      cancelled = true;
    };
  }, []);

  async function authenticateWallet() {
    if (!walletConnected || !effectiveWalletProvider || !walletAddr) {
      return null;
    }

    const normalizedAddress = walletAddr.toLowerCase();
    if (authenticatedAddressRef.current.toLowerCase() === normalizedAddress && authToken) {
      return authToken;
    }

    const provider = new BrowserProvider(effectiveWalletProvider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const message = `Sign in to HashBet\nAddress: ${signerAddress}\nTimestamp: ${Date.now()}`;
    const signature = await signer.signMessage(message);

    const loginRes = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: signerAddress, signature, message }),
    });

    const loginPayload = await loginRes.json();
    if (!loginRes.ok || !loginPayload.success) {
      throw new Error(loginPayload.error || "Wallet login failed");
    }

    const token = loginPayload.data.token;
    localStorage.setItem("authToken", token);
    localStorage.setItem("authAddress", signerAddress.toLowerCase());
    authenticatedAddressRef.current = signerAddress.toLowerCase();
    setAuthToken(token);
    await loadUserData(token);
    return token;
    
      // Ensure user is created in MongoDB
      try {
        const ensureRes = await fetch(apiUrl("/api/auth/ensure-user"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ensureRes.ok) {
          console.warn("Could not ensure user in database:", await ensureRes.json());
        } else {
          console.log("User ensured in database:", await ensureRes.json());
        }
      } catch (err) {
        console.warn("Error ensuring user:", err.message);
      }
  }

  async function fetchPublicConfig() {
    try {
      const response = await fetch(apiUrl("/api/config/public"));
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.success) {
        setContractConfig(payload.data);
        await fetchContractState(payload.data.contractAddress);
      }
    } catch (err) {
      console.warn("Could not load public config", err);
    }
  }

  async function fetchContractState(contractAddress) {
    try {
      const response = await fetch(apiUrl("/api/contract/state"));
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload.success) return;

      setContractConfig((current) => ({
        ...current,
        ...(contractAddress ? { contractAddress } : {}),
        paymentTokenAddress: payload.data.paymentTokenAddress || current.paymentTokenAddress,
        paymentTokenSymbol: payload.data.paymentTokenSymbol || current.paymentTokenSymbol || "USDC",
        paymentTokenDecimals: Number(payload.data.paymentTokenDecimals ?? current.paymentTokenDecimals ?? 6),
        chainId: payload.data.chainId || current.chainId,
      }));
    } catch (err) {
      console.warn("Could not load contract state", err);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await fetch(apiUrl("/api/leaderboard?period=week&limit=20"));
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload.success) return;

      const newData = payload.data.map((entry) => ({
        addr: entry.address,
        wins: Number(entry.wins || 0),
        net: `${Number(entry.net || 0) >= 0 ? "+" : ""}${Number(entry.net || 0).toFixed(3)}`,
      }));

      // Only update if we got data, or if the leaderboard was already empty
      // This prevents the leaderboard from disappearing due to transient API issues
      setLeaderboard((prev) => (newData.length > 0 ? newData : prev));
    } catch (err) {
      console.warn("Could not load leaderboard", err);
    }
  }

  async function loadUserData(token) {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [historyRes, statsRes] = await Promise.all([
        fetch(apiUrl("/api/user/history?limit=20"), { headers }),
        fetch(apiUrl("/api/user/stats"), { headers }),
      ]);
      const statsPayload = statsRes.ok ? await statsRes.json() : null;

      let backendHistory = [];

      if (historyRes.ok) {
        const historyPayload = await historyRes.json();
        if (historyPayload.success) {
          backendHistory = historyPayload.data.map((entry) => ({
            ...entry,
            amount: Number.parseFloat(entry.amount),
            payout: Number.parseFloat(entry.payout),
          }));
          const localHistory = readLocalBetCache().map((entry) => ({
            ...entry,
            amount: Number.parseFloat(entry.amount),
            payout: Number.parseFloat(entry.payout),
          }));
          const mergedHistory = mergeBetLists(backendHistory, localHistory);
          setHistory(mergedHistory);

          if (statsPayload?.success) {
            const localStats = calculateStatsFromHistory(mergedHistory);
            setStats({
              wins: localStats.wins,
              losses: localStats.losses,
              net: localStats.net,
            });
          }
        }
      }

      if (statsPayload?.success && backendHistory.length === 0) {
          const localHistory = readLocalBetCache().map((entry) => ({
            ...entry,
            amount: Number.parseFloat(entry.amount),
            payout: Number.parseFloat(entry.payout),
          }));
          const localStats = calculateStatsFromHistory(localHistory);
          setStats({
            wins: localStats.wins,
            losses: localStats.losses,
            net: localStats.net,
          });
      }
    } catch (err) {
      console.warn("Could not load user data", err);
    }
  }

  useEffect(() => {
    fetchPublicConfig();
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (authToken) {
      loadUserData(authToken);
    }
  }, [authToken]);

  async function connectWallet() {
    try {
      if (isMiniPay && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        if (accounts?.[0]) {
          setMiniPayAddress(String(accounts[0]));
        }
        return true;
      }

      await open();
      return false;
    } catch (err) {
      alert(err.message || "Failed to open wallet modal");
      return false;
    }
  }

  function handleBetSettled(betRecord) {
    // Update local state immediately
    setHistory((currentHistory) => mergeBetLists([betRecord], currentHistory).slice(0, 20));
    setStats((currentStats) => ({
      wins: currentStats.wins + (betRecord.result === "win" ? 1 : 0),
      losses: currentStats.losses + (betRecord.result === "lose" ? 1 : 0),
      net: parseFloat(
        (
          currentStats.net +
          (betRecord.result === "win" ? betRecord.payout - betRecord.amount : -betRecord.amount)
        ).toFixed(4)
      ),
    }));
    
    // Refresh from backend after a short delay to ensure it's persisted
    setTimeout(() => {
      if (authToken) {
        loadUserData(authToken);
      }
    }, 1000);
  }

  function handleRefresh(refreshedData) {
    if (refreshedData.history && Array.isArray(refreshedData.history)) {
      const backendHistory = refreshedData.history.map((entry) => ({
          ...entry,
          amount: Number.parseFloat(entry.amount),
          payout: Number.parseFloat(entry.payout),
      }));
      const localHistory = readLocalBetCache().map((entry) => ({
        ...entry,
        amount: Number.parseFloat(entry.amount),
        payout: Number.parseFloat(entry.payout),
      }));
      const mergedHistory = mergeBetLists(backendHistory, localHistory);
      setHistory(mergedHistory);

      if (!refreshedData.stats) {
        const mergedStats = calculateStatsFromHistory(mergedHistory);
        setStats(mergedStats);
      }
    }

    if (refreshedData.stats) {
      const mergedHistory = mergeBetLists(
        refreshedData.history && Array.isArray(refreshedData.history)
          ? refreshedData.history.map((entry) => ({
              ...entry,
              amount: Number.parseFloat(entry.amount),
              payout: Number.parseFloat(entry.payout),
            }))
          : [],
        readLocalBetCache().map((entry) => ({
          ...entry,
          amount: Number.parseFloat(entry.amount),
          payout: Number.parseFloat(entry.payout),
        }))
      );
      const mergedStats = calculateStatsFromHistory(mergedHistory);
      setStats(mergedStats);
    }
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes resultPop { 0%{transform:scale(.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        .content-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .content-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
      `}</style>

      {/* App shell */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          background: COLORS.bg,
          height: "100dvh",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          color: COLORS.text,
          fontFamily: FONTS.body,
          position: "relative",
          borderRadius: 0,
          overflow: "hidden",
          border: `0.5px solid ${COLORS.border}`,
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(${COLORS.border}22 1px, transparent 1px),
              linear-gradient(90deg, ${COLORS.border}22 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Green glow blob */}
        <div
          style={{
            position: "absolute",
            top: -150,
            left: "50%",
            transform: "translateX(-50%)",
            width: 500,
            height: 300,
            background: `radial-gradient(ellipse, ${COLORS.green}0D 0%, transparent 70%)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <Header
          block={block}
          walletConnected={walletConnected}
          walletAddr={walletAddr}
          isMiniPay={isMiniPay}
          onConnect={connectWallet}
        />

        {/* Scrollable content */}
        <div className="content-scroll" style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 5, paddingBottom: 70, overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}>
          {tab === "bet" && (
            <BetPage
              walletConnected={walletConnected}
              connectWallet={connectWallet}
              ensureAuth={authenticateWallet}
              authToken={authToken}
              contractConfig={contractConfig}
              walletProvider={effectiveWalletProvider}
              walletAddress={walletAddr}
              walletBalance={walletBalance}
              tokenSymbol={contractConfig.paymentTokenSymbol}
              poolBalance={poolBalance}
              poolLoading={poolLoading}
              poolError={poolError}
              stats={stats}
              history={history}
              onBetSettled={handleBetSettled}
            />
          )}
          {tab === "history" && <HistoryPage history={history} authToken={authToken} onRefresh={handleRefresh} />}
          {tab === "leaderboard" && <LeaderboardPage leaderboard={leaderboard} onRefreshLeaderboard={fetchLeaderboard} tokenSymbol={contractConfig.paymentTokenSymbol} />}
          {tab === "how" && (
            <HowPage
              contractAddress={contractConfig?.contractAddress}
              chainId={contractConfig?.chainId}
              tokenSymbol={contractConfig.paymentTokenSymbol}
              poolBalance={poolBalance}
              poolLoading={poolLoading}
              poolError={poolError}
            />
          )}
        </div>

        {/* Bottom nav */}
        <BottomNav tab={tab} onTabChange={setTab} />
      </div>
    </>
  );
}
