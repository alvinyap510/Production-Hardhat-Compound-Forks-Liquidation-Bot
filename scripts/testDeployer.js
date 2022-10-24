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

//@Author
/********************/
/* Main Body */
/********************/
async function main() {
  console.log("Deploying TestGetCToken contract");
  const TestGetCTokenFactory = await ethers.getContractFactory("TestGetCToken");
  const TestGetCToken = await TestGetCTokenFactory.deploy(
    "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602"
  );
  await TestGetCToken.deployed();
  console.log("Successfully deployed TestGetCToken at address: ");
  console.log(TestGetCToken.address);
  console.log("\n");

  console.log(
    await TestGetCToken._getCToken("0xdAC17F958D2ee523a2206206994597C13D831ec7")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
