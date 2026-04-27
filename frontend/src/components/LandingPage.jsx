import { useState, useEffect, lazy, Suspense } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

// Lazy load components to prevent import errors
const Hero = lazy(() => import("./LandingPage/Hero"));
const HashDemo = lazy(() => import("./LandingPage/HashDemo"));
const HowItWorks = lazy(() => import("./LandingPage/HowItWorks"));
const Fairness = lazy(() => import("./LandingPage/Fairness"));
const LiveFeed = lazy(() => import("./LandingPage/LiveFeed"));
const Fees = lazy(() => import("./LandingPage/Fees"));
const CeloSection = lazy(() => import("./LandingPage/CeloSection"));
const FAQ = lazy(() => import("./LandingPage/FAQ"));
const CTA = lazy(() => import("./LandingPage/CTA"));
const Footer = lazy(() => import("./LandingPage/Footer"));
const Ticker = lazy(() => import("./LandingPage/Ticker"));
const BackgroundEffects = lazy(() => import("./LandingPage/BackgroundEffects"));
const CustomCursor = lazy(() => import("./LandingPage/CustomCursor"));

export default function LandingPage({ setTab }) {
  // Simple fallback for Safari compatibility
  try {
    return (
      <>
        <style>{`
          .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
          .reveal.visible { opacity: 1; transform: translateY(0); }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @media (max-width: 768px) {
            .hero {
              padding: 140px 20px 80px !important;
            }
            .hero-stats {
              gap: 0 !important;
            }
            .hero-stat {
              padding: 0 20px !important;
            }
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
        `}</style>
        <Suspense fallback={
          <div style={{
            background: COLORS.bg,
            color: COLORS.text,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div>Loading HashBet...</div>
          </div>
        }>
          <div
            style={{
              fontFamily: FONTS.body,
              background: COLORS.bg,
              color: COLORS.text,
              minHeight: "100vh",
              height: "100vh",
              width: "100vw",
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
        </Suspense>
      </>
    );
  } catch (error) {
    console.error('LandingPage render error:', error);
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        background: '#080C0A',
        color: '#E8F5ED',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <h1 style={{ color: '#00FF87', marginBottom: '20px' }}>HashBet</h1>
          <p style={{ marginBottom: '20px' }}>Provably fair block hash prediction on Celo.</p>
          <button
            onClick={() => setTab && setTab('bet')}
            style={{
              padding: '12px 24px',
              background: '#00FF87',
              color: '#080C0A',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Start Betting
          </button>
        </div>
      </div>
    );
  }
}