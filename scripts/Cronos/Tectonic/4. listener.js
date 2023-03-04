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
// const provider = new providers.JsonRpcProvider({
//   // url: process.env.MAINNET_RPC_URL,
//   url: process.env.MAINNET_PUBLIC_ANKR_RPC_URL,
// });

// const CHAIN_ID = 1;

// //@Switch
const provider = hre.ethers.provider;
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);

const accountsNearLiquidation = require("./informations/accountsNearLiquidation.js");
const abi = require("./informations/abi.js");
const contractAddresses = require("./informations/contractAddresses.js");
const accountsInteractedWithProtocol = require("./informations/accountsInteractedWithProtocol.js");
const accountsInteractedWithProtocolFiltered = require("./informations/accountsInteractedWithProtocolFiltered.js");

/********************/
/* Recreate Instances */
/********************/

const CompoundForksLiquidationBotV2 = new ethers.Contract(
  "0x4b4A3d1ee97504f54F77550C1Ce11A0E3B37f9dD",
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
  // await mine(10000000);
  console.log(`Signer is: ${await signer.getAddress()}`);
  const { chainId } = await provider.getNetwork();
  console.log(`Chain is ${chainId}`);
  console.log("\n");

  provider.on("block", async (block) => {
    console.log("\n");
    console.log(`Beginning of block: ${block}`);
    console.log("\n");
    const feeData = await provider.getFeeData();

    //Method 1
    for (let i = 0; i < accountsNearLiquidation.length; i++) {
      console.log("\n");
      console.log(`Liquidation target: ${accountsNearLiquidation[i].address}`);
      console.log("\n");

      try {
        console.log(
          await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
            "0xb3831584acb95ED9cCb0C11f677B5AD01DeaeEc0",
            accountsNearLiquidation[i].address,
            0
          )
        );

        await CompoundForksLiquidationBotV2.flashLiquidate(
          "0xb3831584acb95ED9cCb0C11f677B5AD01DeaeEc0",
          accountsNearLiquidation[i].address,
          0
        );
      } catch {
        // console.log("Flashbot or Provider endpoint error");
        console.log(
          `Not yet liquidtable ${accountsNearLiquidation[i].address}`
        );
      }
    }
    console.log("\n");
    console.log(`End of block trying: ${block}`);
    console.log("\n");
  });
}
main();
