import { useState, useEffect } from "react";
import { COLORS } from "../../constants/colors";
import { FONTS } from "../../constants/fonts";

export default function HashDemo() {
  const [hash, setHash] = useState("A3F8C2E097B4D1F6A2C8E5B9D0F3A7C1E4B8D2F0A5C9E3B7D1F4A8C2E6B0D5F9A1");
  const [firstChar, setFirstChar] = useState("A");

  useEffect(() => {
    const interval = setInterval(() => {
      const hexChars = '0123456789ABCDEF';
      const newFirst = hexChars[Math.floor(Math.random() * 16)];
      const newHash = newFirst + Array.from({ length: 63 }, () => hexChars[Math.floor(Math.random() * 16)]).join('');
      setFirstChar(newFirst);
      setHash(newHash);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isBig = parseInt(firstChar, 16) >= 8;

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        maxWidth: 760,
        margin: "0 auto 0",
        padding: "0 40px",
      }}
    >
      <div
        style={{
          background: COLORS.card,
          border: `0.5px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: "20px 24px",
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
            opacity: 0.5,
          }}
        />
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: COLORS.muted,
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 8,
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
          Latest Block Hash · Block #28,447,201
        </div>
        <div
          style={{
            fontFamily: FONTS.mono,
            fontSize: 13,
            color: COLORS.mutedLight,
            wordBreak: "break-all",
            lineHeight: 1.8,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: COLORS.green, fontSize: 18, fontWeight: 700, textShadow: `0 0 14px ${COLORS.green}` }}>{firstChar}</span>
          {hash.slice(1)}
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              color: COLORS.muted,
            }}
          >
            First char: <strong style={{ color: COLORS.green }}>{firstChar}</strong> (decimal {parseInt(firstChar, 16)})
          </span>
          <span
            style={{
              display: "inline-block",
              marginLeft: 12,
              padding: "2px 10px",
              borderRadius: 4,
              background: `rgba(0,255,135,0.1)`,
              border: `0.5px solid rgba(0,255,135,0.3)`,
              fontSize: 11,
              color: COLORS.green,
            }}
          >
            {isBig ? 'BIG — 8 or above ✓' : 'SMALL — 7 or below ✓'}
          </span>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 11,
              color: COLORS.muted,
              marginLeft: "auto",
            }}
          >
            5 sec block time
          </span>
        </div>
      </div>
    </div>
  );
}