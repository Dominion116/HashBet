const hre = require("hardhat");

async function main() {
  console.log("Deploying HashBet contract...");

  const HashBet = await hre.ethers.getContractFactory("HashBet");
  const sepoliaUsdc = "0x01C5C0122039549AD1493B8220cABEdD739BC44E";
  const paymentTokenAddress = process.env.PAYMENT_TOKEN_ADDRESS || (hre.network.name === "celoSepolia" ? sepoliaUsdc : "");
  const paymentTokenSymbol = process.env.PAYMENT_TOKEN_SYMBOL || "USDC";
  const tokenAbi = [
    "function decimals() view returns (uint8)",
    "function approve(address spender, uint256 value) returns (bool)",
  ];

  if (!paymentTokenAddress) {
    throw new Error("PAYMENT_TOKEN_ADDRESS is required to deploy the ERC20-based contract");
  }

  const hashBet = await HashBet.deploy(paymentTokenAddress, paymentTokenSymbol);
  await hashBet.waitForDeployment();

  console.log("✓ HashBet deployed to:", await hashBet.getAddress());

  const initialFund = process.env.INITIAL_POOL_FUND_TOKEN_AMOUNT || "0";
  const token = new hre.ethers.Contract(paymentTokenAddress, tokenAbi, (await hre.ethers.getSigners())[0]);
  const tokenDecimals = Number(await token.decimals());
  const initialFundValue = hre.ethers.parseUnits(initialFund, tokenDecimals);

  if (initialFundValue > 0n) {
    const approveTx = await token.approve(await hashBet.getAddress(), initialFundValue);
    await approveTx.wait();

    const fundTx = await hashBet.fundPool(initialFundValue);
    await fundTx.wait();
    console.log(`✓ Pool funded with ${initialFund} ${paymentTokenSymbol}`);
  } else {
    console.log("ℹ Skipping initial pool funding (INITIAL_POOL_FUND_TOKEN_AMOUNT=0)");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
