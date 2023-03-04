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
const provider = hre.ethers.provider;
//@Running on Node

// const provider = new providers.JsonRpcProvider({
//   // url: process.env.CRONOS_PUBLIC_RPC_URL2,
//   url: process.env.CRONOS_PRIVATE_DEV_RPC_URL,
// });
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
const CHAIN_ID = 25;

//@Constants
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

/********************/
/* Configurations */
/********************/
//@Author
const targetedAccount = "0xd2516d22a363841651bfa1f2bb1c5685ff044393";

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
  const NewLiquidationBotFactory = await hre.ethers.getContractFactory(
    "CompoundForksLiquidationBotV2TectonicSpecialized"
  );
  const NewLiquidationBot = await NewLiquidationBotFactory.deploy(
    "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", //Wrapped CRO
    "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae" //VVS Router
  );
  await NewLiquidationBot.deployed();
  console.log("Successfully deployed NewLiquidationBot at address: ");
  console.log(NewLiquidationBot.address);
  console.log("\n");

  let accounts = "";
  let accountsArray = [];
  // for (let i = 0; i < accountsInteractedWithProtocolFiltered.length; i++) {
  for (let i = 5000; i < 6500; i++) {
    let accountObj = {};
    try {
      //Get Health Factor
      const healthFactor =
        await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
          TectonicCore.address,
          accountsInteractedWithProtocolFiltered[i]
        );
      //Get Total Debt
      const ret = await NewLiquidationBot.callStatic._updateAccountState(
        TectonicCore.address,
        accountsInteractedWithProtocolFiltered[i]
      );
      const totalDebt = ret[6];
      const totalCollateral = ret[7];

      //Push into array
      if (healthFactor > 700000n && healthFactor < 1150000n && totalDebt > 30) {
        /*
        console.log(accountsInteractedWithProtocolFiltered[i]);
        console.log(healthFactor);
        accounts += `"`;
        accounts += accountsInteractedWithProtocolFiltered[i].toString();
        accounts += `",`;
        */
        console.log(accountsInteractedWithProtocolFiltered[i]);
        console.log(healthFactor);
        accountObj.address = accountsInteractedWithProtocolFiltered[i];
        accountObj.healthFactor = healthFactor.toString();
        accountObj.totalDebt = totalDebt.toString();
        accountObj.totalCollateral = totalCollateral.toString();
        // accountObj.healthFactor = healthFactor;
        // accountObj.totalDebt = totalDebt;
        // accountObj.totalCollateral = totalCollateral;
        accountsArray.push(accountObj);
      }
      console.log(i);
      console.log(accountsInteractedWithProtocolFiltered[i]);
    } catch (err) {
      console.log(`Error in getting info${err}`);
    }
  }
  /*
  console.log(accounts);
  fs.appendFile(
    "scripts/Cronos/Tectonic/informations/accountsNearLiquidation.txt",
    accounts,
    function (err) {
      if (err) throw err;
    }
  );
  */
  // console.log(accounts);
  fs.appendFile(
    "scripts/Cronos/Tectonic/informations/accountsNearLiquidation.js",
    JSON.stringify(accountsArray),
    function (err) {
      if (err) throw err;
    }
  );
}

main();
