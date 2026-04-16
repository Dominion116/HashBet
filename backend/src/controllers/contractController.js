const { JsonRpcProvider, Contract } = require("ethers");

const hashBetAbi = [
  "function owner() view returns (address)",
  "function totalPool() view returns (uint256)",
  "function totalBetsPlaced() view returns (uint256)",
  "function totalBetsWon() view returns (uint256)",
  "function paymentToken() view returns (address)",
  "function paymentTokenSymbol() view returns (string)",
];

const contractController = {
  async getContractState(req, res) {
    try {
      const rpcUrl = process.env.CELO_RPC_URL;
      const contractAddress = process.env.CONTRACT_ADDRESS;

      if (!rpcUrl || !contractAddress || contractAddress === "0x...") {
        return res.status(400).json({
          success: false,
          error: "Missing CELO_RPC_URL or CONTRACT_ADDRESS",
        });
      }

      const provider = new JsonRpcProvider(rpcUrl);
      const contract = new Contract(contractAddress, hashBetAbi, provider);

      const [owner, totalPool, totalBetsPlaced, totalBetsWon] = await Promise.all([
        contract.owner(),
        contract.totalPool(),
        contract.totalBetsPlaced(),
        contract.totalBetsWon(),
      ]);
      const [paymentToken, paymentTokenSymbol] = await Promise.all([
        contract.paymentToken(),
        contract.paymentTokenSymbol(),
      ]);

      res.json({
        success: true,
        data: {
          owner,
          totalPool: totalPool.toString(),
          totalBetsPlaced: Number(totalBetsPlaced),
          totalBetsWon: Number(totalBetsWon),
          chainId: Number.parseInt(process.env.CELO_CHAIN_ID || "42220", 10),
          contractAddress,
          paymentTokenAddress: paymentToken,
          paymentTokenSymbol,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: `Failed to read contract state: ${err.message}`,
      });
    }
  },
};

module.exports = contractController;
