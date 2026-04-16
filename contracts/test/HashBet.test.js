const { expect } = require("chai");
const { ethers } = require("hardhat");

const USDC_SEPOLIA_TOKEN = process.env.PAYMENT_TOKEN_ADDRESS || "0x01C5C0122039549AD1493B8220cABEdD739BC44E";
const FORK_RPC_URL = process.env.CELO_SEPOLIA_RPC_URL;
const runForkTests = Boolean(FORK_RPC_URL);

(runForkTests ? describe : describe.skip)("HashBet (forked Celo Sepolia)", () => {
  let hashBet;

  beforeEach(async () => {
    await ethers.provider.send("hardhat_reset", [
      {
        forking: {
          jsonRpcUrl: FORK_RPC_URL,
        },
      },
    ]);

    const HashBet = await ethers.getContractFactory("HashBet");
    hashBet = await HashBet.deploy(USDC_SEPOLIA_TOKEN, "USDC");
    await hashBet.waitForDeployment();
  });

  it("stores token metadata and USDC bet bounds", async () => {
    expect(await hashBet.paymentToken()).to.equal(USDC_SEPOLIA_TOKEN);
    expect(await hashBet.paymentTokenSymbol()).to.equal("USDC");
    expect(await hashBet.paymentTokenDecimals()).to.equal(6);
    expect(await hashBet.minBetAmount()).to.equal(20000n);
    expect(await hashBet.maxBetAmount()).to.equal(100000n);
  });
});
