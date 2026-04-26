import { useState, useEffect } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import Hero from "./LandingPage/Hero";
import HashDemo from "./LandingPage/HashDemo";
import HowItWorks from "./LandingPage/HowItWorks";
import Fairness from "./LandingPage/Fairness";
import LiveFeed from "./LandingPage/LiveFeed";
import Fees from "./LandingPage/Fees";
import CeloSection from "./LandingPage/CeloSection";
import FAQ from "./LandingPage/FAQ";
import CTA from "./LandingPage/CTA";
import Footer from "./LandingPage/Footer";
import Ticker from "./LandingPage/Ticker";
import BackgroundEffects from "./LandingPage/BackgroundEffects";
import CustomCursor from "./LandingPage/CustomCursor";

export default function LandingPage({ setTab }) {
  return (
    <>
      <style>{`
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .hero { padding: 140px 20px 80px !important; }
          .hero-stats { gap: 0 !important; }
          .hero-stat { padding: 0 20px !important; }
          section { padding: 72px 20px !important; }
          .steps { grid-template-columns: 1fr 1fr !important; }
          .step { border-right: none !important; border-bottom: 0.5px solid ${COLORS.border} !important; }
          .fairness-grid { grid-template-columns: 1fr !important; }
          .fees-grid { grid-template-columns: 1fr !important; }
          .celo-grid { grid-template-columns: 1fr 1fr !important; }
          .cta-banner { margin: 0 20px 60px !important; }
          footer { padding: 40px 20px 24px !important; }
          .footer-inner { flex-direction: column !important; }
          .live-row { grid-template-columns: 1fr 1fr 60px !important; }
          .live-row .col4, .live-row .col5 { display: none !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          /* Tablet styles if needed */
        }
      `}</style>
      <div
        style={{
          fontFamily: FONTS.body,
          background: COLORS.bg,
          color: COLORS.text,
          minHeight: "100vh",
          overflowX: "hidden",
          cursor: "none",
        }}
      >
        <CustomCursor />
        <BackgroundEffects />
        <Ticker />
      <Hero setTab={setTab} />
      <HashDemo />
      <HowItWorks />
      <Fairness />
      <LiveFeed />
      <Fees />
      <CeloSection />
      <FAQ />
      <CTA setTab={setTab} />
      <Footer />
      </div>
    </>
  );
}