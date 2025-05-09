//@Author
//run by
//npx hardhat run scripts/mainnet/listenerBotV2StrikeFinanceFlashbots.js --network mainnet
//or
//node scripts/mainnet/multiListenerBotV2StrikeFinanceFlashbots.js

/******************************\
A. Imports & Environments
\******************************/
//Import env configurations
require("dotenv").config();

//Setup Environment & Providers
const hre = require("hardhat");
const fs = require("fs");

const { providers, Wallet, ethers } = require("ethers");
const {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
} = require("@flashbots/ethers-provider-bundle");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

//Constants
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

//@Mainnet
const provider = new providers.JsonRpcProvider({
  // url: process.env.MAINNET_RPC_URL,
  url: process.env.MAINNET_PUBLIC_ANKR_RPC_URL,
});

const CHAIN_ID = 1;

// //@Switch Local
// const provider = hre.ethers.provider;

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net";
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
// const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
// c28053c8d262f2face2849de5d2bac8f31ec1921a5b84e8eff7208a3c6e24bd6;

//@Liquidation Target
const accountsToLiquidate = [
  // "0xf4d50e97ee3cbc375f0ce5c8d1bdf1cca5dede19",
  "0xee2826453a4fd5afeb7ceffeef3ffa2320081268",
  // "0x5ca9568930f61ba40d90f4d1707a93ab78db6325",
];
// const accountsToLiquidate = ["0xeCA023e03127205dCa2F196B8b32bdD748203587"];

/********************/
/* Recreate Instances */
/********************/

const CompoundForksLiquidationBotV2 = new ethers.Contract(
  "0xa8d15de0cF2a7f6e3BfD3f68b6EdC6b0b946d6a6",
  [
    {
      inputs: [
        {
          internalType: "contract ILendingPoolAddressesProvider",
          name: "_addressProvider",
          type: "address",
        },
        {
          internalType: "address",
          name: "_weth",
          type: "address",
        },
        {
          internalType: "address",
          name: "_router",
          type: "address",
        },
        {
          internalType: "address",
          name: "_oneInchRouter",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "val",
          type: "uint256",
        },
      ],
      name: "Log",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "_from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_assetAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "LogWithdraw",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "ADDRESSES_PROVIDER",
      outputs: [
        {
          internalType: "contract ILendingPoolAddressesProvider",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "BORROWER_TO_BE_LIQUIDATED",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "BRIBE",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "COMPTROLLER",
      outputs: [
        {
          internalType: "contract Comptroller",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "CONTRACT_OWNER",
      outputs: [
        {
          internalType: "address payable",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "CTOKEN_COLLATERAL_TO_SEIZE",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "CTOKEN_REPAY",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FACTORY",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FLASH_LOAN_AMOUNT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FLASH_LOAN_MODE",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "FLASH_LOAN_TOKEN",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "GWEI",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "LENDING_POOL",
      outputs: [
        {
          internalType: "contract ILendingPool",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MAX_INT",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ONE_INCH_ROUTER",
      outputs: [
        {
          internalType: "contract OneInchRouterInterface",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PRICE_FEED",
      outputs: [
        {
          internalType: "contract IPriceFeed",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "ROUTER",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "SEIZED_ASSET",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "WETH",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_CTokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "_getCollateralUnderlyingAmountInToken",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_CTokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "_getDebtUnderlyingAmountInToken",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_lendingPool",
          type: "address",
        },
        {
          internalType: "address",
          name: "_factory",
          type: "address",
        },
      ],
      name: "_getFlashloanSource",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_CTokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_priceFeed",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "_getUsdValueOfAsset",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
        {
          internalType: "address",
          name: "_repayTokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_repayCTokenAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_repayAmount",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_cTokenCollateralToSeize",
          type: "address",
        },
      ],
      name: "_liquidate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_comptroller",
          type: "address",
        },
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "_updateAccountState",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_flashLoanToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_flashLoanAmount",
          type: "uint256",
        },
      ],
      name: "aaveV2FlashLoanCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_tokenAddress",
          type: "address",
        },
        {
          internalType: "address",
          name: "_spenderAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
      ],
      name: "approveToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address[]",
          name: "assets",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "premiums",
          type: "uint256[]",
        },
        {
          internalType: "address",
          name: "initiator",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "params",
          type: "bytes",
        },
      ],
      name: "executeOperation",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_comptroller",
          type: "address",
        },
        {
          internalType: "address",
          name: "_borrowerToLiquidate",
          type: "address",
        },
        {
          internalType: "uint32",
          name: "_bribePercentage",
          type: "uint32",
        },
      ],
      name: "flashLiquidate",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_comptroller",
          type: "address",
        },
        {
          internalType: "address",
          name: "_borrower",
          type: "address",
        },
      ],
      name: "getHealthFactor",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_cTokenCollateral",
          type: "address",
        },
      ],
      name: "getSupplyBalance",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_sender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_amount0",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_amount1",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "uniswapV2Call",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_flashLoanToken",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_flashLoanAmount",
          type: "uint256",
        },
      ],
      name: "uniswapV2FlashLoanCall",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_addressProvider",
          type: "address",
        },
      ],
      name: "updateLendingPoolAddressesProvider",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_router",
          type: "address",
        },
      ],
      name: "updateRouter",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_assetAddress",
          type: "address",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      stateMutability: "payable",
      type: "receive",
    },
  ],
  signer
);

/******************************\
Main Function
\******************************/

async function main() {
  //An identifying key for signing payloads to establish reputation and whitelisting
  console.log(process.argv);

  const authSigner = new Wallet(
    "0x8905100000000000000000000000000000000000000000000000000000000000"
  );

  //Create Flashbot Instance
  const flashbot = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    FLASHBOTS_ENDPOINT
  );

  console.log(`Signer is: ${await signer.getAddress()}`);
  const { chainId } = await provider.getNetwork();
  console.log(`Chain is ${chainId}`);
  console.log(`Monitoring accounts:`);
  console.log(accountsToLiquidate);

  console.log("\n");

  provider.on("block", async (block) => {
    console.log("\n");
    console.log(`Beginning of block: ${block}`);
    console.log("\n");
    const feeData = await provider.getFeeData();

    //Method 1
    for (let i = 0; i < accountsToLiquidate.length; i++) {
      console.log("\n");
      console.log(`Liquidation target: ${accountsToLiquidate[i]}`);
      console.log("\n");
      const transactionData =
        "0x8615c7a3000000000000000000000000e2e17b2cbbf48211fa7eb8a875360e5e39ba2602000000000000000000000000" +
        accountsToLiquidate[i].slice(2) +
        "0000000000000000000000000000000000000000000000000000000000000020";

      // const signedTx = await flashbot.signBundle([
      //   {
      //     signer: signer,
      //     transaction: {
      //       chainId: 1,
      //       type: 2,
      //       maxFeePerGas: feeData.maxFeePerGas * 1.5,
      //       maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2,
      //       gasLimit: 8000000,
      //       value: 0,
      //       data: transactionData,
      //       // data: "0x",
      //       //   data: "0x8615c7a3000000000000000000000000e2e17b2cbbf48211fa7eb8a875360e5e39ba2602000000000000000000000000ee2826453a4fd5afeb7ceffeef3ffa23200812680000000000000000000000000000000000000000000000000000000000000014",
      //       to: "0xa8d15de0cF2a7f6e3BfD3f68b6EdC6b0b946d6a6",
      //       // to: "0x",
      //     },
      //   },
      // ]);

      const targetBlock = block + 1;

      // console.log(
      //   await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
      //     "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
      //     accountsToLiquidate[i],
      //     50
      //   )
      // );

      // await CompoundForksLiquidationBotV2.flashLiquidate(
      //   "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
      //   accountsToLiquidate[i],
      //   0,
      //   { maxFeePerGas: 40 * GWEI, maxPriorityFeePerGas: 0.5 * GWEI }
      // );

      //Signing flashbot transaction
      const signedTx = await flashbot.signBundle([
        {
          signer: signer,
          transaction: {
            chainId: 1,
            type: 2,
            maxFeePerGas: feeData.maxFeePerGas * 1,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 1,
            // maxFeePerGas: 26n * GWEI,
            // maxPriorityFeePerGas: 3n * GWEI,
            gasLimit: 4000000,
            value: 0,
            data: transactionData,
            to: "0xa8d15de0cF2a7f6e3BfD3f68b6EdC6b0b946d6a6",
          },
        },
      ]);

      // try {
      //Simulate

      const sim = await flashbot.simulate(signedTx, targetBlock);

      console.log(sim);

      if ("error" in sim || "error" in sim.results[0]) {
        // if ("error" in sim) {
        console.log("\n");
        console.log(`simulation error:`);
        console.log(`Failed in Block Number: ${block}`);
        console.log(`Failed to liquidate target: ${accountsToLiquidate[i]}`);
        console.log("\n");
      } else {
        // console.log(`${JSON.stringify(sim, null, 2)}`);
        console.log("\nSimulation Success!\n");

        // // console.log(
        // //   await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
        // //     "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
        // //     accountsToLiquidate[i],
        // //     5
        // //   )
        // // );

        // // await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
        // //   "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
        // //   accountsToLiquidate[i],
        // //   50
        // // );
        // // process.exit(0);

        // console.log("\n");
        // console.log("simulation success!");
        // console.log(`Success in Block Number: ${block}`);
        // console.log(`Liquidation target: ${accountsToLiquidate[i]}`);
        // console.log("\n");

        //Writing log

        const message = `Enter liquidation processs at block ${block} on account ${accountsToLiquidate[i]}`;

        fs.appendFile("./scripts/Mainnet/log.txt", message, function (err) {
          if (err) throw err;
          console.log("Written Deployed Addresses!");
        });

        //Trying liquidation
        console.log("Beginning liquidation...");
        console.log("\n");

        const res = await flashbot.sendRawBundle(signedTx, targetBlock);
        const res2 = await flashbot.sendRawBundle(signedTx, targetBlock + 1);
        const res3 = await flashbot.sendRawBundle(signedTx, targetBlock + 2);
        if ("error" in res) {
          throw new Error(res.error.message);
        }
        //Sending the transactions to flashbot relay
        const bundleResolution = await res.wait();
        if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
          //If transaction successfully included, exits
          console.log(`Congrats, included in ${targetBlock}`);
          process.exit(0);
        } else if (
          bundleResolution ===
          FlashbotsBundleResolution.BlockPassedWithoutInclusion
        ) {
          //If transaction not included, repeat the callback function on new block
          console.log(`Not included in ${targetBlock}`);
        } else if (
          bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
        ) {
          //If error, exits
          console.log("Nonce too high, bailing");
          process.exit(1);
        }
      }
      // }
      // } catch {
      //   // console.log("Flashbot or Provider endpoint error");
      //   console.log(`Not yet liquidtable ${accountsToLiquidate[i]}`);
      // }
    }
    console.log("\n");
    console.log(`End of block trying: ${block}`);
    console.log("\n");
    await mine(10000000);

    //Method 2 try static call method
    /*
    try {
      await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
        "0xe2e17b2cbbf48211fa7eb8a875360e5e39ba2602",
        "0xee2826453a4fd5afeb7ceffeef3ffa2320081268",
        0
      );

      const signedTx = await flashbot.signBundle([
        {
          signer: signer,
          transaction: {
            chainId: 1,
            type: 2,
            maxFeePerGas: GWEI * 20n,
            maxPriorityFeePerGas: GWEI * 3n,
            gasLimit: 8000000,
            value: 0,
            data: transactionData,
            //   data: "0x8615c7a3000000000000000000000000e2e17b2cbbf48211fa7eb8a875360e5e39ba2602000000000000000000000000ee2826453a4fd5afeb7ceffeef3ffa23200812680000000000000000000000000000000000000000000000000000000000000014",
            to: "0xa8d15de0cF2a7f6e3BfD3f68b6EdC6b0b946d6a6",
          },
        },
      ]);

      const targetBlock = block + 1;

      //Simulate

      const sim = await flashbot.simulate(signedTx, targetBlock);

      // console.log(sim);

      // if ("error" in sim.results[0]) {
      //   console.log("\n");
      //   console.log(`simulation error: ${sim.results[0].error}`);
      //   console.log(`Failed in Block Number: ${block}`);
      //   console.log(`Liquidation target: ${accountToLiquidate}`);
      //   console.log("\n");
      // } else {
      //   console.log(`${JSON.stringify(sim, null, 2)}`);
      console.log("\n");
      console.log("simulation success!");
      console.log(`Success in Block Number: ${block}`);
      console.log(`Liquidation target: ${accountToLiquidate}`);
      console.log("\n");

      //Trying liquidation
      console.log("Beginning liquidation...");
      console.log("\n");

      const res = await flashbot.sendRawBundle(signedTx, targetBlock);
      if ("error" in res) {
        throw new Error(res.error.message);
      }
      //Sending the transactions to flashbot relay
      const bundleResolution = await res.wait();
      if (bundleResolution === FlashbotsBundleResolution.BundleIncluded) {
        //If transaction successfully included, exits
        console.log(`Congrats, included in ${targetBlock}`);
        process.exit(0);
      } else if (
        bundleResolution ===
        FlashbotsBundleResolution.BlockPassedWithoutInclusion
      ) {
        //If transaction not included, repeat the callback function on new block
        console.log(`Not included in ${targetBlock}`);
      } else if (
        bundleResolution === FlashbotsBundleResolution.AccountNonceTooHigh
      ) {
        //If error, exits
        console.log("Nonce too high, bailing");
        process.exit(1);
        // }
      }
    } catch {
      console.log("\n");
      console.log("Static call failed");
      console.log("\n");
    } */
  });
}
main();
