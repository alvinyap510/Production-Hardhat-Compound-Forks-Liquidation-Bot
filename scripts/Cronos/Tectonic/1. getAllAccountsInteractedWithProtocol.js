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

//@Import informations
const abi = require("./informations/abi.js");
const contractAddresses = require("./informations/contractAddresses.js");
const accountsInteractedWithProtocol = require("./informations/accountsInteractedWithProtocol.js");

//@Network
//@Running on Hardhat
/*
const provider = hre.ethers.provider;
const signer = provider.getSigner();
*/

//@Running on Node

const provider = new providers.JsonRpcProvider({
  url: process.env.CRONOS_PUBLIC_RPC_URL,
  // url: "https://nd-070-506-734.p2pify.com/7b59bf0d5f2e9e10f4a4f7e69fef4544",
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
//Scanned 570286 - 5446890

// const beginningBlockNumber = 570286;
// const endingBlockNumber = 5446890;
const beginningBlockNumber = 4890000;
const endingBlockNumber = 5450392;
// const endingBlockNumber = 572286;
const searchBlocks = 2000;

/********************/
/* Recreate Instances */
/********************/

const TectonicCore = new ethers.Contract(
  contractAddresses.TectonicCore,
  abi.TectonicCore,
  signer
);

//@Author
/********************/
/* Main Body */
/********************/

async function main() {
  const allEnteredMarketAccounts = accountsInteractedWithProtocol;

  for (let i = beginningBlockNumber; i < endingBlockNumber; i += searchBlocks) {
    let endingBlock;
    if (i + searchBlocks > endingBlockNumber) endingBlock = endingBlockNumber;
    else endingBlock = i + searchBlocks;

    const events = await TectonicCore.queryFilter(
      "MarketEntered",
      i,
      endingBlock
    );

    for (let i = 0; i < events.length; i++) {
      if (!allEnteredMarketAccounts.includes(events[i].args.account)) {
        allEnteredMarketAccounts.push(events[i].args.account);
        console.log(events[i].args.account);
      }
    }
    // console.log(events);
    console.log(`Blocks scanned untill: ${endingBlock}`);
  }
  console.log(allEnteredMarketAccounts);

  let message = "const accountsInteractedWithProtocol = [";
  for (let i = 0; i < allEnteredMarketAccounts.length; i++) {
    message += `"` + allEnteredMarketAccounts[i].toString() + `",`;
  }
  message += "] \n module.exports = accountsInteractedWithProtocol";
  fs.appendFile(
    "scripts/Cronos/Tectonic/informations/accountsInteractedWithProtocol.js",
    message,
    function (err) {
      if (err) throw err;
    }
  );

  /* Redundant way
  try {
    const openingMessage = "const accountsInteractedWithProtocol = [";
    fs.appendFile(
      "scripts/Cronos/Tectonic/informations/accountsInteractedWithProtocol.js",
      openingMessage,
      function (err) {
        if (err) throw err;
      }
    );

    let message = ``;
    for (let i = 0; i < allEnteredMarketAccounts.length; i++) {
      message += `"` + allEnteredMarketAccounts[i].toString() + `",`;
    }
    // message += `"`;
    fs.appendFile(
      "scripts/Cronos/Tectonic/informations/accountsInteractedWithProtocol.js",
      message,
      function (err) {
        if (err) throw err;
        // console.log("Written all accounts!");
      }
    );
  } finally {
    const closingMessage =
      "] \n module.exports = accountsInteractedWithProtocol;";
    fs.appendFile(
      "scripts/Cronos/Tectonic/informations/accountsInteractedWithProtocol.js",
      closingMessage,
      function (err) {
        if (err) throw err;
      }
    );
  }
  */
}

main();
