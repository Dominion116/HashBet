const configController = {
  getPublicConfig(req, res) {
    const defaultSepoliaUsdc = "0x01C5C0122039549AD1493B8220cABEdD739BC44E";

    res.json({
      success: true,
      data: {
        chainId: Number.parseInt(process.env.CELO_CHAIN_ID || "42220", 10),
        contractAddress: process.env.CONTRACT_ADDRESS || null,
        rpcUrl: process.env.CELO_RPC_URL || null,
        paymentTokenAddress: process.env.PAYMENT_TOKEN_ADDRESS || defaultSepoliaUsdc,
        paymentTokenSymbol: process.env.PAYMENT_TOKEN_SYMBOL || "USDC",
        paymentTokenDecimals: Number.parseInt(process.env.PAYMENT_TOKEN_DECIMALS || "6", 10),
      },
    });
  },
};

module.exports = configController;
