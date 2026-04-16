export const NAV_ITEMS = [
  { id: "bet", label: "Bet", icon: "◈" },
  { id: "history", label: "History", icon: "◷" },
  { id: "leaderboard", label: "Leaders", icon: "◆" },
  { id: "how", label: "How to", icon: "◎" },
];

export const MEDALS = ["🥇", "🥈", "🥉"];

export const STEPS = [
  { n: "01", label: "Pick Big or Small", desc: "Big = hex 8–F · Small = 0–7 · Equal probability" },
  { n: "02", label: "Bet USDC", desc: "Amount locked in smart contract on Celo" },
  { n: "03", label: "Block is mined", desc: "Hash is unknowable until mined — tamper-proof" },
  { n: "04", label: "First char decides", desc: "Win 1.88× your stake or lose it · Instant payout" },
];

export const FAKE_LEADERBOARD = [
  { addr: "0xA3F2…81CE", wins: 142, net: "+312.4" },
  { addr: "0x9B1D…4A70", wins: 118, net: "+241.8" },
  { addr: "0x5C8E…F330", wins: 97, net: "+189.2" },
  { addr: "0x2E4A…9D12", wins: 84, net: "+143.0" },
  { addr: "0x7F6B…11A8", wins: 71, net: "+92.5" },
  { addr: "0x3C1D…E024", wins: 65, net: "+74.3" },
  { addr: "0x8A9F…2B40", wins: 58, net: "+51.6" },
];
