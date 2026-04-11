import { useState, useEffect, useRef } from "react";
import { BrowserProvider, Contract, Interface, parseEther } from "ethers";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { StatsRow } from "../StatsRow";
import { ChoiceButtons } from "./ChoiceButtons";
import { AmountInput } from "./AmountInput";
import { PayoutDisplay } from "./PayoutDisplay";
import { PlaceBetButton } from "./PlaceBetButton";
import { ConfirmingPhase, MiningPhase, ResultPhase } from "./PhaseHandlers";
import { HashReveal } from "./HashReveal";

const CONTRACT_ABI = [
  "event BetPlaced(uint256 indexed betId, address indexed player, uint256 amount, bool isBig, uint256 blockNumber)",
  "function placeBet(bool _isBig) payable",
  "function settleBet(uint256 _betId)",
  "function getBetDetails(uint256 betId) view returns (address player, uint256 amount, bool isBig, bool settled, bool won)",
];

const MIN_BET = 0.02;
const MAX_BET = 0.1;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function BetPage({
  walletConnected,
  connectWallet,
  authToken,
  contractConfig,
  stats,
  history,
  onBetSettled,
}) {
  const [choice, setChoice] = useState(null);
  const [amount, setAmount] = useState("0.02");
  const [phase, setPhase] = useState("idle");
  const [miningProg, setMiningProg] = useState(0);
  const [lastHash, setLastHash] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const ivRef = useRef(null);
  const timeoutRef = useRef(null);

  const amt = parseFloat(amount) || 0;
  const isValidAmount = amt >= MIN_BET && amt <= MAX_BET;
  const payout = (amt * 1.88).toFixed(3);

  async function placeBet() {
    if (!walletConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    if (!authToken) {
      alert("Wallet auth token missing. Reconnect wallet.");
      return;
    }

    if (!contractConfig?.contractAddress) {
      alert("Contract address not configured in backend.");
      return;
    }
    if (!choice || !isValidAmount) return;

    try {
      setPhase("confirming");
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractConfig.contractAddress, CONTRACT_ABI, signer);
      const iface = new Interface(CONTRACT_ABI);

      const tx = await contract.placeBet(choice === "Big", {
        value: parseEther(String(amt)),
      });

      setPhase("mining");
      setMiningProg(20);

      const receipt = await tx.wait();
      setMiningProg(40);

      let betId = null;
      let targetBlock = null;

      for (const log of receipt.logs || []) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "BetPlaced") {
            betId = Number(parsed.args.betId);
            targetBlock = Number(parsed.args.blockNumber);
            break;
          }
        } catch (err) {
          // Ignore non-contract logs
        }
      }

      if (betId == null || targetBlock == null) {
        throw new Error("Could not parse BetPlaced event from transaction receipt");
      }

      let progress = 40;
      while ((await provider.getBlockNumber()) <= targetBlock) {
        progress = Math.min(progress + 8, 80);
        setMiningProg(progress);
        await sleep(1800);
      }

      const settleTx = await contract.settleBet(betId);
      await settleTx.wait();
      setMiningProg(98);

      const details = await contract.getBetDetails(betId);
      const won = Boolean(details.won);
      const result = won ? "win" : "lose";

      const blockData = await provider.getBlock(targetBlock);
      const blockHash = (blockData?.hash || tx.hash).replace(/^0x/i, "").toUpperCase();

      const rec = {
        hash: blockHash,
        choice,
        amount: amt,
        payout: amt * 1.88,
        result,
        blockNumber: targetBlock,
      };

      const saveRes = await fetch("/api/bets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          hash: rec.hash,
          choice: rec.choice,
          amount: rec.amount,
          payout: rec.payout,
          result: rec.result,
          blockNumber: rec.blockNumber,
        }),
      });

      if (!saveRes.ok) {
        const payload = await saveRes.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to save bet to backend");
      }

      setLastHash(rec.hash);
      setLastResult(result);
      setMiningProg(100);
      setPhase("result");
      onBetSettled(rec);
    } catch (err) {
      console.error(err);
      alert(err.message || "Bet transaction failed");
      setPhase("idle");
      setMiningProg(0);
    }
  }

  function reset() {
    setPhase("idle");
    setLastHash(null);
    setLastResult(null);
    setChoice(null);
  }

  useEffect(() => {
    return () => {
      if (ivRef.current) clearInterval(ivRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const total = history.length;

  return (
    <div>
      <StatsRow stats={stats} total={total} />

      <div style={{ padding: "14px 14px 0" }}>
        {/* Description */}
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 12,
            color: COLORS.mutedLight,
            lineHeight: 1.5,
            marginBottom: 14,
          }}
        >
          Predict whether the first hex char of the next block hash will be{" "}
          <span style={{ color: COLORS.amber, fontWeight: 600 }}>Big (8–F)</span> or{" "}
          <span style={{ color: "#60A9FF", fontWeight: 600 }}>Small (0–7)</span>
          {" "}with bets between 0.02 and 0.1 CELO.
        </div>

        <ChoiceButtons choice={choice} setChoice={setChoice} phase={phase} />
        <AmountInput amount={amount} setAmount={setAmount} phase={phase} />
        <PayoutDisplay payout={payout} />

        {phase === "idle" && (
          <PlaceBetButton
            walletConnected={walletConnected}
            phase={phase}
            choice={choice}
            amt={amt}
            isValidAmount={isValidAmount}
            onConnect={connectWallet}
            onPlaceBet={placeBet}
          />
        )}

        {phase === "confirming" && <ConfirmingPhase />}
        {phase === "mining" && <MiningPhase miningProg={miningProg} />}
        {phase === "result" && (
          <ResultPhase
            lastResult={lastResult}
            payout={payout}
            amount={amt}
            onReset={reset}
          />
        )}

        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: COLORS.muted,
            textAlign: "center",
            letterSpacing: "0.06em",
            marginTop: 10,
          }}
        >
          6% fee on winnings · 50/50 odds · Provably fair
        </div>
      </div>

      <HashReveal lastHash={lastHash} phase={phase} />
    </div>
  );
}
