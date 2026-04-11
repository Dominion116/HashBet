require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

function getAccounts() {
  const privateKey = process.env.PRIVATE_KEY;

  if (!privateKey || !privateKey.startsWith("0x") || privateKey.length !== 66) {
    return [];
  }

  return [privateKey];
}

function getEnv(name, fallback = "") {
  return process.env[name] || fallback;
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    celoSepolia: {
      url: getEnv("CELO_SEPOLIA_RPC_URL", "https://forno.celo-sepolia.celo-testnet.org"),
      accounts: getAccounts(),
      chainId: 11142220,
    },
    celoTestnet: {
      url: getEnv("CELO_TESTNET_RPC_URL", getEnv("CELO_SEPOLIA_RPC_URL", "https://forno.celo-sepolia.celo-testnet.org")),
      accounts: getAccounts(),
      chainId: 11142220,
    },
    celoMainnet: {
      url: getEnv("CELO_MAINNET_RPC_URL", "https://forno.celo.org"),
      accounts: getAccounts(),
      chainId: 42220,
    },
  },
  etherscan: {
    apiKey: {
      celoMainnet: getEnv("CELOSCAN_API_KEY", getEnv("ETHERSCAN_API_KEY", "")),
      celoSepolia: getEnv("CELOSCAN_API_KEY", getEnv("ETHERSCAN_API_KEY", "")),
      celoTestnet: getEnv("CELOSCAN_API_KEY", getEnv("ETHERSCAN_API_KEY", "")),
    },
    customChains: [
      {
        network: "celoSepolia",
        chainId: 11142220,
        urls: {
          apiURL: "https://celo-sepolia.blockscout.com/api",
          browserURL: "https://celo-sepolia.blockscout.com",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
  },
};
