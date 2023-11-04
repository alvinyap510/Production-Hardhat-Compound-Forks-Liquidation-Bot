//@Author
/********************/
/* Development Environment & Utilities */
/********************/
const hre = require("hardhat");
const { getContractAddress } = require("ethers/lib/utils");
const { ethers, run, network } = require("hardhat");
const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model.js");
const fs = require("fs");
const provider = ethers.provider;
const signer = ethers.provider.getSigner();
let tx;

/********************/
/* Configuration */
/********************/
/* Aave or Aave Forks Protocol */
const LENDING_POOL_ADDRESSES_PROVIDER =
  "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5";
/* Uniswap V2 or Forks Factory */
const UNISWAP_V2_FACTORY = "0x1111111254fb6c44bAC0beD2854e76F90643097d";
/* Uniswap V2 or Forks Router */
const UNISWAP_V2_ROUTER = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
/* Blockchain Wrapped Token Address */
const WETH = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

/********************/
/* Main Body */
/********************/
async function main() {
  console.log("Deploying CompoundForksLiquidationBotV2 contract");
  const CompoundForksLiquidationBotV2Factory = await ethers.getContractFactory(
    "CompoundForksLiquidationBotV2"
  );
  const CompoundForksLiquidationBotV2 =
    await CompoundForksLiquidationBotV2Factory.deploy(
      LENDING_POOL_ADDRESSES_PROVIDER,
      UNISWAP_V2_ROUTER,
      WETH,
      UNISWAP_V2_FACTORY,
      { gasLimit: 30000000 }
    );
  await CompoundForksLiquidationBotV2.deployed();
  console.log(
    "Successfully deployed CompoundForksLiquidationBotV2 at address: "
  );
  console.log(CompoundForksLiquidationBotV2.address);
  console.log("\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
