import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { COLORS } from "./constants/colors";
import { FONTS } from "./constants/fonts";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { BetPage } from "./components/BetPage";
import { HistoryPage } from "./components/HistoryPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { HowPage } from "./components/HowPage";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const apiUrl = (path) => `${API_BASE}${path}`;

export default function HashBetMini() {
  const [tab, setTab] = useState("bet");
  const [block, setBlock] = useState(28_447_201);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddr, setWalletAddr] = useState("");
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken") || "");
  const [contractConfig, setContractConfig] = useState({
    chainId: 11142220,
    contractAddress: "",
    rpcUrl: "",
  });
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, net: 0 });
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setBlock((b) => b + 1), 5000);
    return () => clearInterval(t);
  }, []);

  async function fetchPublicConfig() {
    try {
      const response = await fetch(apiUrl("/api/config/public"));
      if (!response.ok) return;
      const payload = await response.json();
      if (payload.success) {
        setContractConfig(payload.data);
      }
    } catch (err) {
      console.warn("Could not load public config", err);
    }
  }

  async function fetchLeaderboard() {
    try {
      const response = await fetch(apiUrl("/api/leaderboard?period=week&limit=20"));
      if (!response.ok) return;
      const payload = await response.json();
      if (!payload.success) return;

      setLeaderboard(
        payload.data.map((entry) => ({
          addr: entry.address,
          wins: Number(entry.wins || 0),
          net: `${Number(entry.net || 0) >= 0 ? "+" : ""}${Number(entry.net || 0).toFixed(1)}`,
        }))
      );
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

      if (historyRes.ok) {
        const historyPayload = await historyRes.json();
        if (historyPayload.success) {
          setHistory(
            historyPayload.data.map((entry) => ({
              ...entry,
              amount: Number.parseFloat(entry.amount),
              payout: Number.parseFloat(entry.payout),
            }))
          );
        }
      }

      if (statsRes.ok) {
        const statsPayload = await statsRes.json();
        if (statsPayload.success) {
          setStats({
            wins: Number(statsPayload.data.wins || 0),
            losses: Number(statsPayload.data.losses || 0),
            net: Number.parseFloat(statsPayload.data.net || 0),
          });
        }
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
    if (!window.ethereum) {
      alert("No wallet detected. Install MetaMask or a compatible wallet.");
      return false;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      if (contractConfig.chainId) {
        const targetHex = `0x${Number(contractConfig.chainId).toString(16)}`;
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: targetHex }],
          });
        } catch (switchErr) {
          console.warn("Network switch skipped/failed", switchErr);
        }
      }

      const message = `Sign in to HashBet\nAddress: ${address}\nTimestamp: ${Date.now()}`;
      const signature = await signer.signMessage(message);

      const loginRes = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, message }),
      });

      const loginPayload = await loginRes.json();
      if (!loginRes.ok || !loginPayload.success) {
        throw new Error(loginPayload.error || "Wallet login failed");
      }

      const token = loginPayload.data.token;
      localStorage.setItem("authToken", token);
      setAuthToken(token);
      setWalletAddr(address);
      setWalletConnected(true);
      await loadUserData(token);
      return true;
    } catch (err) {
      alert(err.message || "Failed to connect wallet");
      return false;
    }
  }

  function handleBetSettled(betRecord) {
    setHistory((currentHistory) => [betRecord, ...currentHistory.slice(0, 19)]);
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
      `}</style>

      {/* App shell */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          background: COLORS.bg,
          minHeight: 680,
          display: "flex",
          flexDirection: "column",
          color: COLORS.text,
          fontFamily: FONTS.body,
          position: "relative",
          borderRadius: 20,
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
          onConnect={connectWallet}
        />

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 5, paddingBottom: 70 }}>
          {tab === "bet" && (
            <BetPage
              walletConnected={walletConnected}
              connectWallet={connectWallet}
              authToken={authToken}
              contractConfig={contractConfig}
              stats={stats}
              history={history}
              onBetSettled={handleBetSettled}
            />
          )}
          {tab === "history" && <HistoryPage history={history} />}
          {tab === "leaderboard" && <LeaderboardPage leaderboard={leaderboard} />}
          {tab === "how" && <HowPage />}
        </div>

        {/* Bottom nav */}
        <BottomNav tab={tab} onTabChange={setTab} />
      </div>
    </>
  );
}
