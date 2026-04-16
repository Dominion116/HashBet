const configController = {
  getPublicConfig(req, res) {
    res.json({
      success: true,
      data: {
        chainId: Number.parseInt(process.env.CELO_CHAIN_ID || "42220", 10),
        contractAddress: process.env.CONTRACT_ADDRESS || null,
        rpcUrl: process.env.CELO_RPC_URL || null,
        paymentTokenAddress: process.env.PAYMENT_TOKEN_ADDRESS || null,
        paymentTokenSymbol: process.env.PAYMENT_TOKEN_SYMBOL || "cUSD",
      },
    });
  },
};

module.exports = configController;
