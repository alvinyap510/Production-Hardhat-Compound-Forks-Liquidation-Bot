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
//   url: process.env.MAINNET_RPC_URL,
// });
const provider = new providers.JsonRpcProvider({
  // url: process.env.MAINNET_RPC_URL,
  url: process.env.MAINNET_PUBLIC_ANKR_RPC_URL,
});

const CHAIN_ID = 1;

// //@Switch Local
// const provider = ethers.provider;

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net";
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);

//@Liquidation Target
const accountsToLiquidate = [
  // "0x4c74c6978de5f9f6972397648a7092b345911ee8",
  // "0xee2826453a4fd5afeb7ceffeef3ffa2320081268",
  // "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5",
  // "0x5ca9568930f61ba40d90f4d1707a93ab78db6325",
  // "0xeca023e03127205dca2f196b8b32bdd748203587",
  // "0x6d478cb16317680a517ff89253f82032efdc31ba",
  // "0x7bf97c7a86508cdb54cccbd3e853042b14778ee9",
  // "0x79828e235f405e96fae2f7279cbb7f8aecb46dec",
  // "0x41a9b21b791693730f57154ceed2a2a3607ef1ef",
  "0xeca023e03127205dca2f196b8b32bdd748203587",
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

  console.log(
    await CompoundForksLiquidationBotV2.callStatic.getHealthFactor(
      "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
      "0xeca023e03127205dca2f196b8b32bdd748203587"
    )
  );
}
main();
