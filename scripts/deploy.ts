import { ethers, run } from "hardhat";

const USDT = "0x82DCEC6aa3c8BFE2C96d40d8805EE0dA15708643";

async function main() {
  const NFTMintFactory = await ethers.getContractFactory("NFTMint");
  const NFTMint = await NFTMintFactory.deploy("NFT", "NFT", USDT);

  await NFTMint.deployed();

  console.log("NFTMint deployed to:", NFTMint.address);

  await run("verify:verify", {
    address: NFTMint.address,
    constructorArguments: ["NFT", "NFT", USDT],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
