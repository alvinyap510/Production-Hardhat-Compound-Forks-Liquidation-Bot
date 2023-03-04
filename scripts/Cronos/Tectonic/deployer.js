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
const targetedAccount = "0xbf80bb90e82ae6a8669f75abcaed22f97fe72125";

/********************/
/* Recreate Instances */
/********************/
//@Author

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
  console.log("\n");
  console.log(
    "Opening Balance of WETH: " +
      (await provider.getBalance(signer.getAddress()))
  );
  console.log("\n");
  //@Deploy
  console.log(
    "Deploying CompoundForksLiquidationBotV2TectonicSpecialized contract"
  );
  const CompoundForksLiquidationBotV2TectonicSpecializedFactory =
    await hre.ethers.getContractFactory(
      "CompoundForksLiquidationBotV2TectonicSpecialized"
    );
  const CompoundForksLiquidationBotV2TectonicSpecialized =
    await CompoundForksLiquidationBotV2TectonicSpecializedFactory.deploy(
      "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23", //Wrapped CRO
      "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae" //VVS Router
    );
  await CompoundForksLiquidationBotV2TectonicSpecialized.deployed();
  console.log(
    "Successfully deployed CompoundForksLiquidationBotV2TectonicSpecialized at address: "
  );
  console.log(CompoundForksLiquidationBotV2TectonicSpecialized.address);
  console.log("\n");

  /*
  //@Tester
  console.log("Liquidity:");
  console.log(await TectonicCore.getAccountLiquidity(targetedAccount));
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
      TectonicCore.address,
      targetedAccount
    )
  );

  //Time warp
  await mine(80000000);
  await CompoundForksLiquidationBotV2TectonicSpecialized._updateAccountState(
    TectonicCore.address,
    targetedAccount
  );
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.callStatic._updateAccountState(
      TectonicCore.address,
      targetedAccount
    )
  );
  console.log("Liquidity after time warping:");
  console.log(await TectonicCore.getAccountLiquidity(targetedAccount));
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
      TectonicCore.address,
      targetedAccount
    )
  );

  //Test Liquidate
  await CompoundForksLiquidationBotV2TectonicSpecialized.callStatic.flashLiquidate(
    contractAddresses.TectonicCore,
    targetedAccount,
    0
  );

  //Enter real liquidate
  const tx =
    await CompoundForksLiquidationBotV2TectonicSpecialized.flashLiquidate(
      contractAddresses.TectonicCore,
      targetedAccount,
      0
    );

  //Console.log Liquidation Transaction
  console.log(tx);
  console.log(await tx.wait());
  console.log("\n");
  console.log(
    "Ending Balance of WETH: " +
      (await provider.getBalance(signer.getAddress()))
  );
  console.log("\n");
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.callStatic._updateAccountState(
      TectonicCore.address,
      targetedAccount
    )
  );
  */
}

main();
