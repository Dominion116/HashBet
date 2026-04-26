import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function CeloSection() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="celo"
      className="reveal"
      style={{
        background: COLORS.surface,
        borderTop: `0.5px solid ${COLORS.border}`,
        borderBottom: `0.5px solid ${COLORS.border}`,
        padding: "100px 40px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.green,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ width: 28, height: 1, background: COLORS.green }} />
          Powered By
        </div>
        <h2
          style={{
            fontFamily: FONTS.display,
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            color: COLORS.text,
            marginBottom: 20,
          }}
        >
          Why Celo?
        </h2>
        <p
          style={{
            fontSize: 16,
            color: COLORS.mutedLight,
            fontWeight: 300,
            maxWidth: 480,
            margin: "0 auto 56px",
            lineHeight: 1.6,
          }}
        >
          Celo's architecture makes it the perfect home for a provably fair betting game.
        </p>

        <div
          className="celo-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
          }}
        >
          {[
            {
              icon: "⚡",
              title: "~5s Block Time",
              desc: "Results arrive fast. No waiting minutes for your outcome. Celo's consensus is rapid.",
            },
            {
              icon: "💸",
              title: "Ultra-Low Gas",
              desc: "Place bets for under $0.01 in gas. Micro-bets become viable for the first time.",
            },
            {
              icon: "🌍",
              title: "Mobile-First",
              desc: "Celo is designed for mobile wallets. Play from anywhere using Valora or MetaMask.",
            },
            {
              icon: "🔄",
              title: "EVM Compatible",
              desc: "Standard Solidity contracts, full EVM compatibility, and verified on CeloScan.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: "24px 20px",
                borderRadius: 12,
                background: COLORS.card,
                border: `0.5px solid ${COLORS.border}`,
                textAlign: "left",
                transition: "all 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = `rgba(0,255,135,0.25)`;
                e.target.style.background = `rgba(0,255,135,0.08)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = COLORS.border;
                e.target.style.background = COLORS.card;
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 12 }}>{item.icon}</div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 15,
                  fontWeight: 700,
                  color: COLORS.text,
                  marginBottom: 6,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.mutedLight,
                  lineHeight: 1.5,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}