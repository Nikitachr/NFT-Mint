import { expect } from "chai";
import { ethers } from "hardhat";
import {
  MockERC20,
  MockERC20__factory,
  NFTMint,
  NFTMint__factory,
} from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const toTokens = (val: string) => ethers.utils.parseEther(val);

describe("NFTMint", function () {
  let USDT: MockERC20;
  let NFTMint: NFTMint;
  let owner: SignerWithAddress;
  let users: SignerWithAddress[];

  beforeEach(async () => {
    [owner, ...users] = await ethers.getSigners();

    const usdtFactory = (await ethers.getContractFactory(
      "MockERC20"
    )) as MockERC20__factory;
    const NFTMintFactory = (await ethers.getContractFactory(
      "NFTMint"
    )) as unknown as NFTMint__factory;

    USDT = await usdtFactory.deploy("USDT", "USDT", toTokens("100"));
    await USDT.deployed();

    NFTMint = await NFTMintFactory.deploy("NFT", "NFT", USDT.address);
    await NFTMint.deployed();
  });

  it("Mock usdt is deployed", async function () {
    expect(USDT.address).to.be.properAddress;
  });

  it("NFTMint contract is deployed", async function () {
    expect(NFTMint.address).to.be.properAddress;
  });

  describe("mint with avax", () => {
    it("can mint", async () => {
      await expect(NFTMint.mintForAvax(2, { value: toTokens("20") })).to.be.not
        .reverted;
    });
    it("cant mint with wrong value", async () => {
      await expect(NFTMint.mintForAvax(2, { value: toTokens("10") })).to.be
        .reverted;
    });
    it("receive nft's", async () => {
      await NFTMint.mintForAvax(2, { value: toTokens("20") });
      expect(await NFTMint.balanceOf(owner.address)).to.eq(2);
    });
  });

  describe("mint with usdt", () => {
    const approveUSDT = async (value: string) => {
      await USDT.approve(NFTMint.address, toTokens(value));
    };

    it("can mint", async () => {
      await approveUSDT("20");
      await expect(NFTMint.mintForUSDT(2)).to.be.not.reverted;
    });
    it("cant mint without allowance", async () => {
      await expect(NFTMint.mintForAvax(2)).to.be.reverted;
    });
    it("cant mint with wrong allowance", async () => {
      await approveUSDT("10");
      await expect(NFTMint.mintForUSDT(2)).to.be.reverted;
    });
    it("receive nft's", async () => {
      await approveUSDT("20");
      await NFTMint.mintForUSDT(2);
      expect(await NFTMint.balanceOf(owner.address)).to.eq(2);
    });
  });

  describe("change baseURI", () => {
    it("can change baseURI", async () => {
      await expect(NFTMint.setBaseURI("anotherURI")).to.be.not.reverted;
    });
    it("only owner can change base uri", async () => {
      await expect(NFTMint.connect(users[0].address).setBaseURI("anotherURI"))
        .to.be.reverted;
    });
    it("uri is changed", async () => {
      await NFTMint.setBaseURI("anotherURI");
      await NFTMint.mintForAvax(2, { value: toTokens("20") });
      expect(await NFTMint.tokenURI(0)).to.include("anotherURI");
    });
  });
});
