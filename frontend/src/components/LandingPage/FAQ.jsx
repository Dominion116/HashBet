import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function FAQ() {
  const ref = useReveal();
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  const faqs = [
    {
      q: "Can the house cheat or manipulate results?",
      a: "No. The result is determined entirely by the Celo block hash, which is set by the global network of validators — not by us. The commit/reveal scheme prevents any last-block manipulation, and the contract is immutable once deployed.",
    },
    {
      q: "What happens if I don't settle my bet?",
      a: "Settlement is permissionless — anyone can trigger it after the target block is mined. If the target block expires beyond 256 blocks without settlement, the contract automatically refunds your bet in full.",
    },
    {
      q: "What wallets can I use?",
      a: "Any wallet that supports the Celo network: Valora (native Celo mobile wallet), MetaMask (add Celo RPC), Rabby, or any WalletConnect-compatible wallet.",
    },
    {
      q: "Is there a minimum or maximum bet?",
      a: "The minimum bet is 0.01 cUSD. The maximum per bet is limited by the contract pool size — you can't bet more than 5% of the pool in a single bet, to protect its solvency.",
    },
    {
      q: "Can I bet with cUSD instead of CELO?",
      a: "Yes, bets are denominated in cUSD. Gas fees can be paid in CELO or cUSD thanks to Celo's fee abstraction.",
    },
    {
      q: "Where is the smart contract source code?",
      a: "The contract is open source, verified on CeloScan, and available on GitHub. Contract address: 0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B on Celo Mainnet.",
    },
  ];

  return (
    <section
      ref={ref}
      id="faq"
      className="reveal"
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: "100px 40px",
      }}
    >
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.green,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ width: 28, height: 1, background: COLORS.green }} />
          Questions
        </div>
      </div>
      <h2
        style={{
          fontFamily: FONTS.display,
          fontSize: "clamp(32px, 5vw, 54px)",
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: COLORS.text,
        }}
      >
        Frequently Asked
      </h2>

      <div
        style={{
          marginTop: 48,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`faq-item ${open === i ? "open" : ""}`}
            style={{
              border: `0.5px solid ${COLORS.border}`,
              borderRadius: 10,
              background: COLORS.card,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.borderColor = `rgba(0,255,135,0.25)`)}
            onMouseLeave={(e) => (e.target.style.borderColor = COLORS.border)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 20px",
                cursor: "pointer",
                fontFamily: FONTS.body,
                fontSize: 15,
                fontWeight: 500,
                color: COLORS.text,
                gap: 12,
              }}
              onClick={() => toggle(i)}
            >
              <span>{faq.q}</span>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: `rgba(0,255,135,0.08)`,
                  border: `0.5px solid rgba(0,255,135,0.25)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONTS.mono,
                  fontSize: 14,
                  color: COLORS.green,
                  flexShrink: 0,
                  transition: "transform 0.25s",
                  transform: open === i ? "rotate(45deg)" : "none",
                }}
              >
                +
              </div>
            </div>
            <div
              style={{
                maxHeight: open === i ? "200px" : 0,
                overflow: "hidden",
                fontSize: 14,
                color: COLORS.mutedLight,
                lineHeight: 1.65,
                transition: "max-height 0.35s ease, padding 0.25s",
                padding: open === i ? "0 20px 18px" : 0,
                fontWeight: 300,
              }}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}