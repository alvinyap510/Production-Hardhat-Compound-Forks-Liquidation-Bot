//@Author
/********************/
/* Development Environment & Utilities */
/********************/
//@General
require("dotenv").config();
const fs = require("fs");

//@Development
const hre = require("hardhat");
const { providers, Wallet, ethers } = require("ethers");
const { mainModule } = require("process");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

//@Import informations
const abi = require("./informations/abi.js");
const contractAddresses = require("./informations/contractAddresses.js");
const accountsInteractedWithProtocol = require("./informations/accountsInteractedWithProtocol.js");
const accountsInteractedWithProtocolFiltered = require("./informations/accountsInteractedWithProtocolFiltered.js");

//@Network
//@Running on Hardhat
/*
const provider = hre.ethers.provider;
const signer = provider.getSigner();
*/

//@Running on Node

const provider = new providers.JsonRpcProvider({
  //   url: process.env.CRONOS_PUBLIC_RPC_URL,
  url: process.env.CRONOS_PRIVATE_DEV_RPC_URL,
});
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
const CHAIN_ID = 25;

//@Constants
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

/********************/
/* Configurations */
/********************/
//@Author
const targetedAccount = "0x3cb7319df39caf867eba8ed3b18077916f807094";

/********************/
/* Recreate Instances */
/********************/
//@Author

const TectonicCore = new ethers.Contract(
  contractAddresses.TectonicCore,
  abi.TectonicCore,
  signer
);

const CompoundForksLiquidationBotV2TectonicSpecialized = new ethers.Contract(
  contractAddresses.CompoundForksLiquidationBotV2TectonicSpecialized,
  abi.CompoundForksLiquidationBotV2TectonicSpecialized,
  signer
);

//@Author
/********************/
/* Main Body */
/********************/
async function main() {
  const tx =
    await CompoundForksLiquidationBotV2TectonicSpecialized.callStatic.flashLiquidate(
      TectonicCore.address,
      targetedAccount,
      0,
      { gasLimit: 5000000 }
    );
}

main();
