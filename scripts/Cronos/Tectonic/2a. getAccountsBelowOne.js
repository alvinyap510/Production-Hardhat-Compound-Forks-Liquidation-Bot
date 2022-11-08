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
  let accounts = "";
  for (let i = 0; i < accountsInteractedWithProtocolFiltered.length; i++) {
    //@Health Factor 1.0 = 1000000
    try {
      const healthFactor =
        await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
          TectonicCore.address,
          accountsInteractedWithProtocolFiltered[i]
        );
      if (healthFactor > 1n && healthFactor < 1000000n) {
        console.log(accountsInteractedWithProtocolFiltered[i]);
        console.log(healthFactor);
        accounts += `"`;
        accounts += accountsInteractedWithProtocolFiltered[i].toString();
        accounts += `",`;
      }
      console.log(i);
    } catch {}
  }
  console.log(accounts);
  fs.appendFile(
    "scripts/Cronos/Tectonic/informations/accounts.txt",
    accounts,
    function (err) {
      if (err) throw err;
    }
  );
}

main();
