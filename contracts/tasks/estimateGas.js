const { task } = require("hardhat/config");

task("estimate-gas", "Estimate gas costs for placeBet and settleBet")
  .addParam("address", "Contract address")
  .addOptionalParam("tokenAddress", "ERC20 token address (for approval)")
  .setAction(async ({ address, tokenAddress }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const contract = await hre.ethers.getContractAt("HashBet", address, signer);

    const minBet = await contract.minBetAmount();
    const pool = await contract.totalPool();

    console.log("=== Gas Estimation ===");
    console.log(`Contract: ${address}`);
    console.log(`Signer:   ${signer.address}`);
    console.log(`Pool:     ${pool}`);

    if (tokenAddress) {
      const token = await hre.ethers.getContractAt(
        ["function approve(address,uint256) external returns(bool)"],
        tokenAddress,
        signer
      );
      try {
        const approveGas = await token.approve.estimateGas(address, minBet);
        console.log(`\napprove() gas estimate:   ${approveGas}`);
      } catch (e) {
        console.log(`\napprove() estimate failed: ${e.message}`);
      }
    }

    try {
      const placeBetGas = await contract.placeBet.estimateGas(true, minBet);
      console.log(`placeBet() gas estimate:  ${placeBetGas}`);
    } catch (e) {
      console.log(`placeBet() estimate failed: ${e.message}`);
    }

    try {
      const settleBetGas = await contract.settleBet.estimateGas(0n);
      console.log(`settleBet() gas estimate: ${settleBetGas}`);
    } catch (e) {
      console.log(`settleBet() estimate failed (expected if no open bets): ${e.message}`);
    }
  });
