import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";
import { Target, DollarSign, Link, Zap } from "lucide-react";

export default function HowItWorks() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="how"
      className="reveal"
      style={{
        background: COLORS.surface,
        borderTop: `0.5px solid ${COLORS.border}`,
        borderBottom: `0.5px solid ${COLORS.border}`,
        padding: "100px 40px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
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
            Process
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
          How HashBet Works
        </h2>
        <p
          style={{
            fontSize: 16,
            color: COLORS.mutedLight,
            lineHeight: 1.6,
            maxWidth: 520,
            marginTop: 16,
            fontWeight: 300,
          }}
        >
          Four steps, zero trust required. The blockchain is the referee.
        </p>

        <div
          className="steps"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 0,
            marginTop: 60,
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {[
            {
              num: "01 / 04",
              icon: "🎯",
              title: "Pick Your Side",
              desc: "Choose Big (hex 8–F) or Small (hex 0–7). Exactly 8 outcomes each — pure 50/50.",
            },
            {
              num: "02 / 04",
              icon: "💰",
              title: "Lock Your Bet",
              desc: "Send cUSD to the smart contract with a commit hash. Your funds are secured on-chain — no custodian.",
            },
            {
              num: "03 / 04",
              icon: "⛓️",
              title: "Block is Mined",
              desc: "A future block is mined by the Celo network. Its hash was unknowable when you placed your bet — no manipulation possible.",
            },
            {
              num: "04 / 04",
              icon: "⚡",
              title: "Auto-Settled",
              desc: "The contract reads the first hex character and pays out winners instantly. No waiting, no withdrawal requests.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="step"
              style={{
                padding: "32px 28px",
                borderRight: i < 3 ? `0.5px solid ${COLORS.border}` : "none",
                position: "relative",
                transition: "background 0.25s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.background = COLORS.card)}
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 11,
                  color: COLORS.green,
                  letterSpacing: "0.12em",
                  fontWeight: 700,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {step.num}
              </div>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `rgba(0,255,135,0.07)`,
                  border: `0.5px solid rgba(0,255,135,0.15)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                  transition: "box-shadow 0.25s",
                }}
                onMouseEnter={(e) => (e.target.style.boxShadow = `0 0 20px rgba(0,255,135,0.2)`)}
                onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
              >
                <Zap size={20} />
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 8,
                }}
              >
                {step.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: COLORS.mutedLight,
                  lineHeight: 1.6,
                }}
              >
                {step.desc}
              </div>
              {i < 3 && (
                <div
                  style={{
                    position: "absolute",
                    top: 44,
                    right: -12,
                    zIndex: 2,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: COLORS.surface,
                    border: `0.5px solid ${COLORS.border}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONTS.mono,
                    fontSize: 11,
                    color: COLORS.green,
                  }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Entropy formula */}
        <div
          style={{
            marginTop: 24,
            background: COLORS.card,
            border: `0.5px solid ${COLORS.border}`,
            borderRadius: 12,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              color: COLORS.muted,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Entropy Formula
          </span>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 14,
              color: COLORS.text,
              background: COLORS.surface,
              padding: "10px 18px",
              borderRadius: 8,
              border: `0.5px solid ${COLORS.border}`,
            }}
          >
            entropy = <span style={{ color: COLORS.green }}>keccak256</span>(
            <span style={{ color: COLORS.amber }}>revealSecret</span>,{" "}
            <span style={{ color: COLORS.blue }}>blockHash</span>)
          </div>
          <span
            style={{
              fontSize: 13,
              color: COLORS.mutedLight,
            }}
          >
            The commit/reveal scheme ensures neither party can game the result.
          </span>
        </div>
      </div>
    </section>
  );
}