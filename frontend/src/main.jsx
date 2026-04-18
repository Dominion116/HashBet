import React from "react";
import ReactDOM from "react-dom/client";
import { AppKitProvider } from "@reown/appkit/react";
import { celo, celoSepolia } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import HashBetMini from "./App";

const reownProjectId = import.meta.env.VITE_REOWN_PROJECT_ID;
const hasReownProjectId =
  typeof reownProjectId === "string" &&
  reownProjectId.trim().length > 0 &&
  reownProjectId !== "YOUR_REOWN_PROJECT_ID" &&
  reownProjectId !== "your-reown-project-id";

const metadata = {
  name: "HashBet",
  description: "Provably fair stablecoin betting onchain app",
  url: "https://hashbetcelo.vercel.app",
  icons: ["https://reown.com/favicon.ico"],
};

const configuredChainId = Number(import.meta.env.VITE_CELO_CHAIN_ID || 42220);
const selectedNetwork = configuredChainId === 11142220 ? celoSepolia : celo;

const wagmiAdapter = new WagmiAdapter({
  projectId: reownProjectId,
  networks: [selectedNetwork],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {hasReownProjectId ? (
      <AppKitProvider
        projectId={reownProjectId}
        adapters={[wagmiAdapter]}
        networks={[selectedNetwork]}
        metadata={metadata}
      >
        <HashBetMini />
      </AppKitProvider>
    ) : (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          fontFamily: "system-ui, sans-serif",
          background: "#080C0A",
          color: "#E8FFF2",
          textAlign: "center",
        }}
      >
        Missing VITE_REOWN_PROJECT_ID. Add it in Vercel Environment Variables and redeploy.
      </div>
    )}
  </React.StrictMode>
);
