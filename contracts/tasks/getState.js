const { task } = require("hardhat/config");

task("get-state", "Print the current state of a deployed HashBet contract")
  .addParam("address", "Contract address")
  .setAction(async ({ address }, hre) => {
    const contract = await hre.ethers.getContractAt("HashBet", address);

    const [owner, token, symbol, decimals, minBet, maxBet, pool, placed, won] =
      await Promise.all([
        contract.owner(),
        contract.paymentToken(),
        contract.paymentTokenSymbol(),
        contract.paymentTokenDecimals(),
        contract.minBetAmount(),
        contract.maxBetAmount(),
        contract.totalPool(),
        contract.totalBetsPlaced(),
        contract.totalBetsWon(),
      ]);

    const div = 10n ** BigInt(decimals);

    console.log("=== HashBet Contract State ===");
    console.log(`Address:          ${address}`);
    console.log(`Owner:            ${owner}`);
    console.log(`Payment Token:    ${token} (${symbol})`);
    console.log(`Decimals:         ${decimals}`);
    console.log(`Min Bet:          ${(minBet * 10000n) / div / 100n} ${symbol} (${minBet})`);
    console.log(`Max Bet:          ${(maxBet * 10000n) / div / 100n} ${symbol} (${maxBet})`);
    console.log(`Total Pool:       ${pool} raw (${Number(pool) / Number(div)} ${symbol})`);
    console.log(`Total Bets:       ${placed}`);
    console.log(`Total Wins:       ${won}`);
    console.log(`Win Rate:         ${placed > 0n ? (won * 100n) / placed : 0n}%`);
  });
