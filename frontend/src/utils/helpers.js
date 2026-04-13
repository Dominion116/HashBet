export function simHash() {
  return Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join("");
}

export function generateRandomWalletAddress() {
  return "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
}

export function formatWalletAddress(address, prefixLength = 6, suffixLength = 4) {
  if (!address || address.length <= prefixLength + suffixLength) {
    return address || "";
  }

  return `${address.slice(0, prefixLength)}…${address.slice(-suffixLength)}`;
}

export function calculateWinRate(wins, total) {
  return total ? Math.round((wins / total) * 100) : 0;
}

export function formatCELO(value, decimals = 3) {
  return parseFloat(value).toFixed(decimals);
}
