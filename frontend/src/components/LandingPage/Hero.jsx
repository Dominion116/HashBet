import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function Hero({ setTab }) {
  const [stats, setStats] = useState({ bets: 12847, pool: 8420 });

  useEffect(() => {
    // Animate stats
    const animCount = (el, target, suffix = '') => {
      let current = 0;
      const step = target / 60;
      const iv = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString() + suffix;
        if (current >= target) clearInterval(iv);
      }, 16);
    };
    setTimeout(() => {
      animCount(document.getElementById('stat-bets'), stats.bets);
      animCount(document.getElementById('stat-pool'), stats.pool);
    }, 500);
  }, [stats]);

  return (
    <section
      id="play"
      className="hero"
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "160px 40px 100px",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      {/* Hero glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 500,
          background: `radial-gradient(ellipse, rgba(0,255,135,0.10) 0%, transparent 65%)`,
          pointerEvents: "none",
          animation: "breathe 6s ease-in-out infinite",
        }}
      />

      {/* Hero tag */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          border: `0.5px solid ${COLORS.border}`,
          background: COLORS.card,
          padding: "6px 14px",
          borderRadius: 20,
          fontFamily: FONTS.mono,
          fontSize: 11,
          color: COLORS.mutedLight,
          letterSpacing: "0.1em",
          marginBottom: 32,
          animation: "fadeUp 0.6s ease both",
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: COLORS.green,
            boxShadow: `0 0 8px ${COLORS.green}`,
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        Live on Celo Mainnet · Block #28,447,201
      </div>

      {/* Hero title */}
      <h1
        style={{
          fontFamily: FONTS.display,
          fontWeight: 900,
          fontSize: "clamp(52px, 9vw, 110px)",
          lineHeight: 0.92,
          letterSpacing: "-0.02em",
          color: COLORS.text,
          animation: "fadeUp 0.7s 0.1s ease both",
          position: "relative",
        }}
      >
        PREDICT THE NEXT <br /> BLOCK <span style={{ color: COLORS.green, textShadow: "0 0 60px rgba(0,255,135,0.5)" }}>HASH</span>
      </h1>

      {/* Hero sub */}
      <p
        style={{
          fontFamily: FONTS.body,
          fontSize: "clamp(16px, 2vw, 20px)",
          color: COLORS.mutedLight,
          fontWeight: 300,
          maxWidth: 560,
          lineHeight: 1.6,
          margin: "28px auto 0",
          animation: "fadeUp 0.7s 0.2s ease both",
        }}
      >
        Bet on the first character of the next block hash.
        Provably fair, no middlemen, settled entirely by the Celo blockchain.
      </p>

      {/* Hero actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          marginTop: 44,
          animation: "fadeUp 0.7s 0.3s ease both",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setTab("bet")}
          style={{
            padding: "16px 36px",
            borderRadius: 10,
            background: COLORS.green,
            color: COLORS.bg,
            fontFamily: FONTS.display,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            border: "none",
            cursor: "pointer",
            boxShadow: `0 0 30px rgba(0,255,135,0.35)`,
            transition: "all 0.2s",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Start Betting
        </button>
        <a
          href="#how"
          style={{
            padding: "15px 32px",
            borderRadius: 10,
            background: "transparent",
            color: COLORS.mutedLight,
            fontFamily: FONTS.mono,
            fontSize: 13,
            letterSpacing: "0.06em",
            border: `0.5px solid ${COLORS.border}`,
            cursor: "pointer",
            transition: "all 0.2s",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          How it works ↓
        </a>
      </div>

      {/* Hero stats */}
      <div
        className="hero-stats"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          marginTop: 70,
          flexWrap: "wrap",
          animation: "fadeUp 0.7s 0.4s ease both",
        }}
      >
        <div
          className="hero-stat"
          style={{
            padding: "0 40px",
            borderRight: `0.5px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <div
            id="stat-bets"
            style={{
              fontFamily: FONTS.display,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.green,
              textShadow: `0 0 24px rgba(0,255,135,0.35)`,
            }}
          >
            0
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Total Bets
          </div>
        </div>
        <div
          className="hero-stat"
          style={{
            padding: "0 40px",
            borderRight: `0.5px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.green,
              textShadow: `0 0 24px rgba(0,255,135,0.35)`,
            }}
          >
            50%
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Win Probability
          </div>
        </div>
        <div
          className="hero-stat"
          style={{
            padding: "0 40px",
            borderRight: `0.5px solid ${COLORS.border}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: FONTS.display,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.green,
              textShadow: `0 0 24px rgba(0,255,135,0.35)`,
            }}
          >
            1.88×
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Payout Multiplier
          </div>
        </div>
        <div
          className="hero-stat"
          style={{
            padding: "0 40px",
            textAlign: "center",
          }}
        >
          <div
            id="stat-pool"
            style={{
              fontFamily: FONTS.display,
              fontSize: 34,
              fontWeight: 800,
              color: COLORS.green,
              textShadow: `0 0 24px rgba(0,255,135,0.35)`,
            }}
          >
            0
          </div>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: COLORS.muted,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            cUSD in Pool
          </div>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%,100% { opacity: 0.8; transform: translateX(-50%) scale(1); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.08); }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @media (max-width: 768px) {
          .hero-stats { gap: 0; }
          .hero-stat { padding: 0 20px; }
        }
      `}</style>
    </section>
  );
}