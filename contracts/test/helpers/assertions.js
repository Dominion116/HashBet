const { expect } = require("chai");
const { ethers } = require("hardhat");

async function expectRevertWith(tx, message) {
  await expect(tx).to.be.revertedWith(message);
}

async function expectEmit(tx, contract, eventName, args) {
  await expect(tx).to.emit(contract, eventName).withArgs(...args);
}

function toTokenUnits(amount, decimals = 6) {
  return BigInt(amount) * 10n ** BigInt(decimals);
}

function fromTokenUnits(amount, decimals = 6) {
  return Number(amount) / 10 ** decimals;
}

function expectedPayout(betAmount, winMultiplier = 188n, houseEdgeBps = 600n) {
  const gross = (betAmount * winMultiplier) / 100n;
  const houseCut = (gross * houseEdgeBps) / 10000n;
  return gross - houseCut;
}

async function mineBlocks(count) {
  for (let i = 0; i < count; i++) {
    await ethers.provider.send("evm_mine", []);
  }
}

module.exports = {
  expectRevertWith,
  expectEmit,
  toTokenUnits,
  fromTokenUnits,
  expectedPayout,
  mineBlocks,
};
