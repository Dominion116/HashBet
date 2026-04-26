import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function Fees() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="fees"
      className="reveal"
      style={{
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
            Economics
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
          Simple, Transparent Fees
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
          No hidden charges. One fee, clearly stated.
        </p>

        <div
          className="fees-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginTop: 56,
          }}
        >
          {[
            {
              label: "Win Payout",
              value: "1.88×",
              desc: "Winners receive 1.88× their stake automatically. No claims, no delays — straight to your wallet.",
            },
            {
              label: "House Edge",
              value: "6%",
              desc: "A 6% fee on winning payouts sustains the contract pool and protocol. Applied only when you win.",
              valueColor: COLORS.amber,
            },
            {
              label: "Network Gas",
              value: "~¢1",
              desc: "Celo's low-cost transactions mean gas fees are negligible — under $0.01 per bet, payable in CELO or cUSD.",
              valueColor: COLORS.blue,
            },
          ].map((fee, i) => (
            <div
              key={i}
              style={{
                padding: 28,
                borderRadius: 14,
                background: COLORS.card,
                border: `0.5px solid ${COLORS.border}`,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = `rgba(0,255,135,0.3)`;
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4)`;
                const after = e.target.querySelector("::after");
                if (after) after.style.opacity = "0.6";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = COLORS.border;
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
                const after = e.target.querySelector("::after");
                if (after) after.style.opacity = "0";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${COLORS.green}, transparent)`,
                  opacity: 0,
                  transition: "opacity 0.25s",
                }}
              />
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 10,
                  color: COLORS.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                {fee.label}
              </div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 38,
                  fontWeight: 800,
                  color: fee.valueColor || COLORS.green,
                  textShadow: `0 0 24px rgba(0,255,135,0.3)`,
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {fee.value}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: COLORS.mutedLight,
                  lineHeight: 1.5,
                }}
              >
                {fee.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}