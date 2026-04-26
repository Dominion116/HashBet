import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";
import { useReveal } from "../../hooks/useReveal";
import { Search, Lock, BookOpen, Settings } from "lucide-react";

export default function Fairness() {
  const ref = useReveal();
  return (
    <section
      ref={ref}
      id="fairness"
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
            Provably Fair
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
          The Math Doesn't Lie
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
          Every outcome is verifiable by anyone. Open source, on-chain, forever.
        </p>

        <div
          className="fairness-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginTop: 60,
            alignItems: "start",
          }}
        >
          {/* Fairness visual */}
          <div
            style={{
              background: COLORS.card,
              border: `0.5px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${COLORS.green}, transparent)`,
              }}
            />
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.muted,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                marginBottom: 6,
              }}
            >
              Probability Distribution
            </div>
            <div
              style={{
                display: "flex",
                height: 52,
                borderRadius: 8,
                overflow: "hidden",
                border: `0.5px solid ${COLORS.border}`,
                margin: "20px 0 10px",
              }}
            >
              <div
                style={{
                  background: `linear-gradient(90deg, rgba(255,184,48,0.2), rgba(255,184,48,0.12))`,
                  borderRight: `1px solid ${COLORS.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.amber,
                  flex: 1,
                }}
              >
                BIG &nbsp; 50%
              </div>
              <div
                style={{
                  background: `linear-gradient(90deg, rgba(96,169,255,0.12), rgba(96,169,255,0.2))`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONTS.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  color: COLORS.blue,
                  flex: 1,
                }}
              >
                SMALL &nbsp; 50%
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.muted,
                marginBottom: 20,
              }}
            >
              <span>8 outcomes (8,9,A,B,C,D,E,F)</span>
              <span>8 outcomes (0,1,2,3,4,5,6,7)</span>
            </div>
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 11,
                color: COLORS.muted,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              All 16 hex characters
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 6,
                marginBottom: 20,
              }}
            >
              {["0", "1", "2", "3", "4", "5", "6", "7"].map((hex) => (
                <div
                  key={hex}
                  style={{
                    aspectRatio: 1,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    border: `0.5px solid ${COLORS.border}`,
                    background: `rgba(96,169,255,0.1)`,
                    color: COLORS.blue,
                  }}
                >
                  {hex}
                </div>
              ))}
              {["8", "9", "A", "B", "C", "D", "E", "F"].map((hex) => (
                <div
                  key={hex}
                  style={{
                    aspectRatio: 1,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONTS.mono,
                    fontSize: 13,
                    fontWeight: 700,
                    border: `0.5px solid ${COLORS.border}`,
                    background: `rgba(255,184,48,0.12)`,
                    color: COLORS.amber,
                  }}
                >
                  {hex}
                </div>
              ))}
            </div>
            <div
              style={{
                padding: 14,
                background: COLORS.surface,
                borderRadius: 8,
                border: `0.5px solid ${COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 12,
                  color: COLORS.mutedLight,
                }}
              >
                Win → <span style={{ color: COLORS.green }}>1.88× payout</span>{" "}
                &nbsp;·&nbsp; House edge →{" "}
                <span style={{ color: COLORS.amber }}>6%</span>
              </div>
            </div>
          </div>

          {/* Fairness points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              {
                icon: <Search size={18} />,
                title: "Fully On-Chain",
                desc: "Every bet, every result, every payout is recorded on the Celo blockchain. Inspect any transaction in the block explorer.",
              },
              {
                icon: <Lock size={18} />,
                title: "Commit / Reveal Scheme",
                desc: "You submit a hash of your secret before placing. The secret is revealed during settlement — preventing last-block manipulation.",
              },
              {
                icon: <BookOpen size={18} />,
                title: "Open Source Contract",
                desc: "The smart contract is verified and public on CeloScan. No hidden logic, no admin functions that can alter outcomes.",
              },
              {
                icon: <Settings size={18} />,
                title: "No Operator Required",
                desc: "Settlement is permissionless. Anyone can call the settle function after the target block is mined — even if we disappear.",
              },
            ].map((point, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  padding: 20,
                  borderRadius: 12,
                  background: COLORS.card,
                  border: `0.5px solid ${COLORS.border}`,
                  transition: "border-color 0.25s, background 0.25s",
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
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 8,
                    background: `rgba(0,255,135,0.08)`,
                    border: `0.5px solid rgba(0,255,135,0.15)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  {point.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONTS.display,
                      fontSize: 15,
                      fontWeight: 700,
                      color: COLORS.text,
                      marginBottom: 4,
                    }}
                  >
                    {point.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.mutedLight,
                      lineHeight: 1.5,
                    }}
                  >
                    {point.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}