import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";

export default function Footer() {
  const ref = useReveal();
  const [block, setBlock] = useState(28447201);

  useEffect(() => {
    const interval = setInterval(() => setBlock((b) => b + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      ref={ref}
      className="reveal"
      style={{
        position: "relative",
        zIndex: 10,
        borderTop: `0.5px solid ${COLORS.border}`,
        padding: "40px 40px 30px",
      }}
    >
      <div
        className="footer-inner"
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div>
          <a
            href="#"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: COLORS.green,
                color: COLORS.bg,
                fontFamily: FONTS.display,
                fontWeight: 900,
                fontSize: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 20px rgba(0,255,135,0.4)`,
              }}
            >
              #
            </div>
            <div>
              <div
                style={{
                  fontFamily: FONTS.display,
                  fontSize: 18,
                  fontWeight: 800,
                  color: COLORS.text,
                  letterSpacing: "0.02em",
                }}
              >
                HASHBET
              </div>
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  color: COLORS.muted,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                On Celo
              </div>
            </div>
          </a>
          <p
            style={{
              fontSize: 13,
              color: COLORS.muted,
              maxWidth: 240,
              lineHeight: 1.6,
            }}
          >
            Provably fair block hash prediction. No middlemen. No servers. Just math.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: COLORS.muted,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Product
            </div>
            {["How It Works", "Fairness", "Fees", "Play Now"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "")}`}
                style={{
                  display: "block",
                  fontSize: 13,
                  color: COLORS.mutedLight,
                  textDecoration: "none",
                  marginBottom: 8,
                  transition: "color 0.2s",
                }}
              >
                {link}
              </a>
            ))}
          </div>
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: COLORS.muted,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Developers
            </div>
            {["GitHub", "Contract Source", "CeloScan", "Audit Report"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  display: "block",
                  fontSize: 13,
                  color: COLORS.mutedLight,
                  textDecoration: "none",
                  marginBottom: 8,
                  transition: "color 0.2s",
                }}
              >
                {link}
              </a>
            ))}
          </div>
          <div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                color: COLORS.muted,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Community
            </div>
            {["Twitter / X", "Telegram", "Discord", "Celo Forum"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  display: "block",
                  fontSize: 13,
                  color: COLORS.mutedLight,
                  textDecoration: "none",
                  marginBottom: 8,
                  transition: "color 0.2s",
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: `0.5px solid ${COLORS.border}`,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.muted,
            letterSpacing: "0.06em",
          }}
        >
          © 2025 HashBet. Open source, on-chain, forever.
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 14,
            background: COLORS.card,
            border: `0.5px solid ${COLORS.border}`,
            fontFamily: FONTS.mono,
            fontSize: 11,
            color: COLORS.mutedLight,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: COLORS.green,
              boxShadow: `0 0 6px ${COLORS.green}`,
              animation: "pulse 2s infinite",
            }}
          />
          Celo Mainnet · Block #{block.toLocaleString()}
        </div>
      </div>
    </footer>
  );
}