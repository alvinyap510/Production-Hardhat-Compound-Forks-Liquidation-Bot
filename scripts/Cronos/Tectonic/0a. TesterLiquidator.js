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

const provider = hre.ethers.provider;
// const signer = provider.getSigner();

//@Running on Node

// const provider = new providers.JsonRpcProvider({
//   //   url: process.env.CRONOS_PUBLIC_RPC_URL,
//   url: process.env.CRONOS_PRIVATE_DEV_RPC_URL,
// });
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
// const CHAIN_ID = 25;

//@Constants
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

/********************/
/* Configurations */
/********************/
//@Author
// const targetedAccount = "0xc55c7f66c7ffd1f639aeb11763a480e705cee617";
const targetedAccount = "0x22969d4D7231eFfCFb64917c555f1Cb3AA1855B9";

// const mineBlocks = 120000000;
const mineBlocks = 0;

/********************/
/* Recreate Instances */
/********************/
//@Author

const TectonicCore = new ethers.Contract(
  contractAddresses.TectonicCore,
  abi.TectonicCore,
  signer
);

// const CompoundForksLiquidationBotV2TectonicSpecialized = new ethers.Contract(
//   contractAddresses.CompoundForksLiquidationBotV2TectonicSpecialized,
//   abi.CompoundForksLiquidationBotV2TectonicSpecialized,
//   signer
// );

let tx;

//@Author
/********************/
/* Main Body */
/********************/
async function main() {
  /**********************/
  //@Deploying Mock Contracts => Switch
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

  /**********************/
  //@Check Opening Balance
  console.log("\n");
  console.log(
    "Opening Balance of WETH: " +
      (await provider.getBalance(signer.getAddress()))
  );
  console.log("\n");

  //@Check Opening Account Liquidity
  console.log("Liquidity:");
  console.log(await TectonicCore.getAccountLiquidity(targetedAccount));
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
      TectonicCore.address,
      targetedAccount
    )
  );
  /**********************/
  //@Time warp
  console.log("Time Warp:");
  await mine(mineBlocks);
  tx =
    await CompoundForksLiquidationBotV2TectonicSpecialized.callStatic.flashLiquidate(
      TectonicCore.address,
      targetedAccount,
      0,
      { gasLimit: 5000000 }
    );
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

  /**********************/
  //@Test Liquidation
  tx = await CompoundForksLiquidationBotV2TectonicSpecialized.flashLiquidate(
    contractAddresses.TectonicCore,
    targetedAccount,
    0
  );
  // console.log(tx);
  console.log(await tx.wait());
  console.log("\n");

  /**********************/
  //@Show Ending Liquidity of Targeted Account
  //@Check Account Liquidity after liquidation attempt
  console.log("Liquidity after liquidation attempt:");
  console.log(await TectonicCore.getAccountLiquidity(targetedAccount));
  console.log(
    await CompoundForksLiquidationBotV2TectonicSpecialized.getHealthFactor(
      TectonicCore.address,
      targetedAccount
    )
  );

  /**********************/
  //@Check Closing Balance
  console.log("\n");
  console.log(
    "Ending Balance of WETH: " +
      (await provider.getBalance(signer.getAddress()))
  );
  console.log("\n");
  /**********************/
}

main();
