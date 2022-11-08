//@Author
/********************/
/* Development Environment & Utilities */
/********************/
require("dotenv").config();
const hre = require("hardhat");
const { getContractAddress } = require("ethers/lib/utils");
const { ethers, run, network } = require("hardhat");
const {
  Contract,
} = require("hardhat/internal/hardhat-network/stack-traces/model.js");
const fs = require("fs");
const provider = ethers.provider;
// const signer = new ethers.Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
// const signer = provider.getSigner();
const { mine } = require("@nomicfoundation/hardhat-network-helpers");
const { Wallet } = require("ethers");
let tx;
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);
/********************/
/* Recreate */
/********************/

//0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B
//0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602
//0xDE607fe5Cb415d83Fe4A976afD97e5DaEeaedB07 //Ape Finance
const StrikeComptroller = new ethers.Contract(
  "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602",
  [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "action",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "pauseState",
          type: "bool",
        },
      ],
      name: "ActionPaused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "action",
          type: "string",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "pauseState",
          type: "bool",
        },
      ],
      name: "ActionPaused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "contributor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newStrikeSpeed",
          type: "uint256",
        },
      ],
      name: "ContributorStrikeSpeedUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "strikeDelta",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "strikeBorrowIndex",
          type: "uint256",
        },
      ],
      name: "DistributedBorrowerStrike",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "supplier",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "strikeDelta",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "strikeSupplyIndex",
          type: "uint256",
        },
      ],
      name: "DistributedSupplierStrike",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "error",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "info",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "detail",
          type: "uint256",
        },
      ],
      name: "Failure",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "MarketEntered",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "MarketExited",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
      ],
      name: "MarketListed",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "isStriked",
          type: "bool",
        },
      ],
      name: "MarketStriked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldCloseFactorMantissa",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newCloseFactorMantissa",
          type: "uint256",
        },
      ],
      name: "NewCloseFactor",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "oldCollateralFactorMantissa",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newCollateralFactorMantissa",
          type: "uint256",
        },
      ],
      name: "NewCollateralFactor",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldLiquidationIncentiveMantissa",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newLiquidationIncentiveMantissa",
          type: "uint256",
        },
      ],
      name: "NewLiquidationIncentive",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldMaxAssets",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newMaxAssets",
          type: "uint256",
        },
      ],
      name: "NewMaxAssets",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldPauseGuardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newPauseGuardian",
          type: "address",
        },
      ],
      name: "NewPauseGuardian",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract PriceOracle",
          name: "oldPriceOracle",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract PriceOracle",
          name: "newPriceOracle",
          type: "address",
        },
      ],
      name: "NewPriceOracle",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldReserveGuardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newReserveGuardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "oldReserveAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newReserveAddress",
          type: "address",
        },
      ],
      name: "NewReserveGuardian",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldStrikeRate",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newStrikeRate",
          type: "uint256",
        },
      ],
      name: "NewStrikeRate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newSpeed",
          type: "uint256",
        },
      ],
      name: "StrikeBorrowSpeedUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "StrikeGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newSpeed",
          type: "uint256",
        },
      ],
      name: "StrikeSpeedUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract SToken",
          name: "sToken",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newSpeed",
          type: "uint256",
        },
      ],
      name: "StrikeSupplySpeedUpdated",
      type: "event",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract Unitroller",
          name: "unitroller",
          type: "address",
        },
      ],
      name: "_become",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_borrowGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "sToken", type: "address" }],
      name: "_dropStrikeMarket",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "_grantSTRK",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "_mintGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "contract SToken", name: "sToken", type: "address" },
        { internalType: "bool", name: "state", type: "bool" },
      ],
      name: "_setBorrowPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "uint256",
          name: "newCloseFactorMantissa",
          type: "uint256",
        },
      ],
      name: "_setCloseFactor",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "contract SToken", name: "sToken", type: "address" },
        {
          internalType: "uint256",
          name: "newCollateralFactorMantissa",
          type: "uint256",
        },
      ],
      name: "_setCollateralFactor",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "contributor", type: "address" },
        { internalType: "uint256", name: "strikeSpeed", type: "uint256" },
      ],
      name: "_setContributorStrikeSpeed",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "uint256",
          name: "newLiquidationIncentiveMantissa",
          type: "uint256",
        },
      ],
      name: "_setLiquidationIncentive",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "newMaxAssets", type: "uint256" },
      ],
      name: "_setMaxAssets",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "contract SToken", name: "sToken", type: "address" },
        { internalType: "bool", name: "state", type: "bool" },
      ],
      name: "_setMintPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "newPauseGuardian", type: "address" },
      ],
      name: "_setPauseGuardian",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract PriceOracle",
          name: "newOracle",
          type: "address",
        },
      ],
      name: "_setPriceOracle",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address payable",
          name: "newReserveGuardian",
          type: "address",
        },
        {
          internalType: "address payable",
          name: "newReserveAddress",
          type: "address",
        },
      ],
      name: "_setReserveInfo",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "bool", name: "state", type: "bool" }],
      name: "_setSeizePaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "strikeRate_", type: "uint256" },
      ],
      name: "_setStrikeRate",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract SToken[]",
          name: "sToken",
          type: "address[]",
        },
        { internalType: "uint256[]", name: "supplySpeeds", type: "uint256[]" },
        { internalType: "uint256[]", name: "borrowSpeeds", type: "uint256[]" },
      ],
      name: "_setStrikeSpeeds",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "bool", name: "state", type: "bool" }],
      name: "_setTransferPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "contract SToken", name: "sToken", type: "address" },
      ],
      name: "_supportMarket",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "accountAssets",
      outputs: [{ internalType: "contract SToken", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "admin",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "allMarkets",
      outputs: [{ internalType: "contract SToken", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "borrowAmount", type: "uint256" },
      ],
      name: "borrowAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "borrowGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "borrowAmount", type: "uint256" },
      ],
      name: "borrowVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "user", type: "address" }],
      name: "canClaimStrikeBySuppling",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "contract SToken", name: "sToken", type: "address" },
      ],
      name: "checkMembership",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address[]", name: "holders", type: "address[]" },
        {
          internalType: "contract SToken[]",
          name: "sTokens",
          type: "address[]",
        },
        { internalType: "bool", name: "borrowers", type: "bool" },
        { internalType: "bool", name: "suppliers", type: "bool" },
      ],
      name: "claimStrike",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "holder", type: "address" }],
      name: "claimStrike",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "holder", type: "address" },
        {
          internalType: "contract SToken[]",
          name: "sTokens",
          type: "address[]",
        },
      ],
      name: "claimStrike",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "closeFactorMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "comptrollerImplementation",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address[]", name: "sTokens", type: "address[]" },
      ],
      name: "enterMarkets",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sTokenAddress", type: "address" },
      ],
      name: "exitMarket",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAccountLiquidity",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getAllMarkets",
      outputs: [
        { internalType: "contract SToken[]", name: "", type: "address[]" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAssetsIn",
      outputs: [
        { internalType: "contract SToken[]", name: "", type: "address[]" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getBlockNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "address", name: "sTokenModify", type: "address" },
        { internalType: "uint256", name: "redeemTokens", type: "uint256" },
        { internalType: "uint256", name: "borrowAmount", type: "uint256" },
      ],
      name: "getHypotheticalAccountLiquidity",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getSTRKAddress",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "isComptroller",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "lastContributorBlock",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sTokenBorrowed", type: "address" },
        { internalType: "address", name: "sTokenCollateral", type: "address" },
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "liquidateBorrowAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sTokenBorrowed", type: "address" },
        { internalType: "address", name: "sTokenCollateral", type: "address" },
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "actualRepayAmount", type: "uint256" },
        { internalType: "uint256", name: "seizeTokens", type: "uint256" },
      ],
      name: "liquidateBorrowVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "sTokenBorrowed", type: "address" },
        { internalType: "address", name: "sTokenCollateral", type: "address" },
        { internalType: "uint256", name: "actualRepayAmount", type: "uint256" },
      ],
      name: "liquidateCalculateSeizeTokens",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "liquidationIncentiveMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "markets",
      outputs: [
        { internalType: "bool", name: "isListed", type: "bool" },
        {
          internalType: "uint256",
          name: "collateralFactorMantissa",
          type: "uint256",
        },
        { internalType: "bool", name: "isStriked", type: "bool" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "maxAssets",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "minter", type: "address" },
        { internalType: "uint256", name: "mintAmount", type: "uint256" },
      ],
      name: "mintAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "mintGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "minter", type: "address" },
        { internalType: "uint256", name: "actualMintAmount", type: "uint256" },
        { internalType: "uint256", name: "mintTokens", type: "uint256" },
      ],
      name: "mintVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "oracle",
      outputs: [
        { internalType: "contract PriceOracle", name: "", type: "address" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pauseGuardian",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pendingAdmin",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pendingComptrollerImplementation",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "redeemer", type: "address" },
        { internalType: "uint256", name: "redeemTokens", type: "uint256" },
      ],
      name: "redeemAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "redeemer", type: "address" },
        { internalType: "uint256", name: "redeemAmount", type: "uint256" },
        { internalType: "uint256", name: "redeemTokens", type: "uint256" },
      ],
      name: "redeemVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "payer", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "repayBorrowAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "payer", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "actualRepayAmount", type: "uint256" },
        { internalType: "uint256", name: "borrowerIndex", type: "uint256" },
      ],
      name: "repayBorrowVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "reserveAddress",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "reserveGuardian",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sTokenCollateral", type: "address" },
        { internalType: "address", name: "sTokenBorrowed", type: "address" },
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "seizeTokens", type: "uint256" },
      ],
      name: "seizeAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "seizeGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sTokenCollateral", type: "address" },
        { internalType: "address", name: "sTokenBorrowed", type: "address" },
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "seizeTokens", type: "uint256" },
      ],
      name: "seizeVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeAccrued",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeBorrowSpeeds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeBorrowState",
      outputs: [
        { internalType: "uint224", name: "index", type: "uint224" },
        { internalType: "uint32", name: "block", type: "uint32" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "strikeBorrowerIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "strikeClaimThreshold",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeContributorSpeeds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "strikeInitialIndex",
      outputs: [{ internalType: "uint224", name: "", type: "uint224" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "strikeRate",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeSpeeds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "address", name: "", type: "address" },
      ],
      name: "strikeSupplierIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeSupplySpeeds",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "strikeSupplyState",
      outputs: [
        { internalType: "uint224", name: "index", type: "uint224" },
        { internalType: "uint32", name: "block", type: "uint32" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "transferTokens", type: "uint256" },
      ],
      name: "transferAllowed",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "transferGuardianPaused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "sToken", type: "address" },
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "transferTokens", type: "uint256" },
      ],
      name: "transferVerify",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "contributor", type: "address" },
      ],
      name: "updateContributorRewards",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
  signer
);

const CToken = new ethers.Contract(
  // "0x3774E825d567125988Fb293e926064B6FAa71DAB" // USDC
  "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92", // ETH,
  [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "cashPrior",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "interestAccumulated",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "borrowIndex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "AccrueInterest",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "borrowAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "accountBorrows",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "Borrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "error",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "info",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "detail",
          type: "uint256",
        },
      ],
      name: "Failure",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "liquidator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "repayAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sTokenCollateral",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "seizeTokens",
          type: "uint256",
        },
      ],
      name: "LiquidateBorrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "minter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintTokens",
          type: "uint256",
        },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newAdmin",
          type: "address",
        },
      ],
      name: "NewAdmin",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract ComptrollerInterface",
          name: "oldComptroller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract ComptrollerInterface",
          name: "newComptroller",
          type: "address",
        },
      ],
      name: "NewComptroller",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract InterestRateModel",
          name: "oldInterestRateModel",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract InterestRateModel",
          name: "newInterestRateModel",
          type: "address",
        },
      ],
      name: "NewMarketInterestRateModel",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldPendingAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newPendingAdmin",
          type: "address",
        },
      ],
      name: "NewPendingAdmin",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldReserveFactorMantissa",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newReserveFactorMantissa",
          type: "uint256",
        },
      ],
      name: "NewReserveFactor",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "redeemer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "redeemAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "redeemTokens",
          type: "uint256",
        },
      ],
      name: "Redeem",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "payer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "repayAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "accountBorrows",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "RepayBorrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "benefactor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "addAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "ReservesAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "admin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reduceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "ReservesReduced",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "reserveAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reduceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "TransferReserves",
      type: "event",
    },
    {
      constant: false,
      inputs: [],
      name: "_acceptAdmin",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "addAmount", type: "uint256" }],
      name: "_addReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "_becomeImplementation",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "reduceAmount", type: "uint256" },
      ],
      name: "_reduceReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "_resignImplementation",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "newComptroller",
          type: "address",
        },
      ],
      name: "_setComptroller",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract InterestRateModel",
          name: "newInterestRateModel",
          type: "address",
        },
      ],
      name: "_setInterestRateModel",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address payable",
          name: "newPendingAdmin",
          type: "address",
        },
      ],
      name: "_setPendingAdmin",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "uint256",
          name: "newReserveFactorMantissa",
          type: "uint256",
        },
      ],
      name: "_setReserveFactor",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "reduceAmount", type: "uint256" },
      ],
      name: "_transferReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "accrualBlockNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "accrueInterest",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "admin",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOfUnderlying",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "borrowAmount", type: "uint256" },
      ],
      name: "borrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "borrowBalanceCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "borrowBalanceStored",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "borrowIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "borrowRatePerBlock",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "comptroller",
      outputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "exchangeRateCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "exchangeRateStored",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAccountSnapshot",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getCash",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "implementation",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "underlying_", type: "address" },
        {
          internalType: "contract ComptrollerInterface",
          name: "comptroller_",
          type: "address",
        },
        {
          internalType: "contract InterestRateModel",
          name: "interestRateModel_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "initialExchangeRateMantissa_",
          type: "uint256",
        },
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "string", name: "symbol_", type: "string" },
        { internalType: "uint8", name: "decimals_", type: "uint8" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "comptroller_",
          type: "address",
        },
        {
          internalType: "contract InterestRateModel",
          name: "interestRateModel_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "initialExchangeRateMantissa_",
          type: "uint256",
        },
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "string", name: "symbol_", type: "string" },
        { internalType: "uint8", name: "decimals_", type: "uint8" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "interestRateModel",
      outputs: [
        {
          internalType: "contract InterestRateModel",
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "isSToken",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
        {
          internalType: "contract STokenInterface",
          name: "sTokenCollateral",
          type: "address",
        },
      ],
      name: "liquidateBorrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "mintAmount", type: "uint256" },
      ],
      name: "mint",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pendingAdmin",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "protocolSeizeShareMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "redeemTokens", type: "uint256" },
      ],
      name: "redeem",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "redeemAmount", type: "uint256" },
      ],
      name: "redeemUnderlying",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "repayBorrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "repayBorrowBehalf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "reserveFactorMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "seizeTokens", type: "uint256" },
      ],
      name: "seize",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "supplyRatePerBlock",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalBorrows",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "totalBorrowsCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "underlying",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
  signer
);
const CToken2 = new ethers.Contract(
  // "0x3774E825d567125988Fb293e926064B6FAa71DAB" // USDC
  "0x3774E825d567125988Fb293e926064B6FAa71DAB", // ETH,
  [
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "cashPrior",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "interestAccumulated",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "borrowIndex",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "AccrueInterest",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "borrowAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "accountBorrows",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "Borrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "error",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "info",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "detail",
          type: "uint256",
        },
      ],
      name: "Failure",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "liquidator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "repayAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "sTokenCollateral",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "seizeTokens",
          type: "uint256",
        },
      ],
      name: "LiquidateBorrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "minter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "mintTokens",
          type: "uint256",
        },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newAdmin",
          type: "address",
        },
      ],
      name: "NewAdmin",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract ComptrollerInterface",
          name: "oldComptroller",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract ComptrollerInterface",
          name: "newComptroller",
          type: "address",
        },
      ],
      name: "NewComptroller",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "contract InterestRateModel",
          name: "oldInterestRateModel",
          type: "address",
        },
        {
          indexed: false,
          internalType: "contract InterestRateModel",
          name: "newInterestRateModel",
          type: "address",
        },
      ],
      name: "NewMarketInterestRateModel",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldPendingAdmin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newPendingAdmin",
          type: "address",
        },
      ],
      name: "NewPendingAdmin",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "oldReserveFactorMantissa",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newReserveFactorMantissa",
          type: "uint256",
        },
      ],
      name: "NewReserveFactor",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "redeemer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "redeemAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "redeemTokens",
          type: "uint256",
        },
      ],
      name: "Redeem",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "payer",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "borrower",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "repayAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "accountBorrows",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalBorrows",
          type: "uint256",
        },
      ],
      name: "RepayBorrow",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "benefactor",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "addAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "ReservesAdded",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "admin",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reduceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "ReservesReduced",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "guardian",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "reserveAddress",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "reduceAmount",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newTotalReserves",
          type: "uint256",
        },
      ],
      name: "TransferReserves",
      type: "event",
    },
    {
      constant: false,
      inputs: [],
      name: "_acceptAdmin",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "uint256", name: "addAmount", type: "uint256" }],
      name: "_addReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
      name: "_becomeImplementation",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "reduceAmount", type: "uint256" },
      ],
      name: "_reduceReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "_resignImplementation",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "newComptroller",
          type: "address",
        },
      ],
      name: "_setComptroller",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract InterestRateModel",
          name: "newInterestRateModel",
          type: "address",
        },
      ],
      name: "_setInterestRateModel",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "address payable",
          name: "newPendingAdmin",
          type: "address",
        },
      ],
      name: "_setPendingAdmin",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "uint256",
          name: "newReserveFactorMantissa",
          type: "uint256",
        },
      ],
      name: "_setReserveFactor",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "reduceAmount", type: "uint256" },
      ],
      name: "_transferReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "accrualBlockNumber",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "accrueInterest",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "admin",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "spender", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "owner", type: "address" }],
      name: "balanceOfUnderlying",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "borrowAmount", type: "uint256" },
      ],
      name: "borrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "borrowBalanceCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "borrowBalanceStored",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "borrowIndex",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "borrowRatePerBlock",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "comptroller",
      outputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "exchangeRateCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "exchangeRateStored",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ internalType: "address", name: "account", type: "address" }],
      name: "getAccountSnapshot",
      outputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "getCash",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "implementation",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "underlying_", type: "address" },
        {
          internalType: "contract ComptrollerInterface",
          name: "comptroller_",
          type: "address",
        },
        {
          internalType: "contract InterestRateModel",
          name: "interestRateModel_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "initialExchangeRateMantissa_",
          type: "uint256",
        },
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "string", name: "symbol_", type: "string" },
        { internalType: "uint8", name: "decimals_", type: "uint8" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        {
          internalType: "contract ComptrollerInterface",
          name: "comptroller_",
          type: "address",
        },
        {
          internalType: "contract InterestRateModel",
          name: "interestRateModel_",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "initialExchangeRateMantissa_",
          type: "uint256",
        },
        { internalType: "string", name: "name_", type: "string" },
        { internalType: "string", name: "symbol_", type: "string" },
        { internalType: "uint8", name: "decimals_", type: "uint8" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "interestRateModel",
      outputs: [
        {
          internalType: "contract InterestRateModel",
          name: "",
          type: "address",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "isSToken",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
        {
          internalType: "contract STokenInterface",
          name: "sTokenCollateral",
          type: "address",
        },
      ],
      name: "liquidateBorrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "mintAmount", type: "uint256" },
      ],
      name: "mint",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pendingAdmin",
      outputs: [{ internalType: "address payable", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "protocolSeizeShareMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "redeemTokens", type: "uint256" },
      ],
      name: "redeem",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "redeemAmount", type: "uint256" },
      ],
      name: "redeemUnderlying",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "repayBorrow",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "repayAmount", type: "uint256" },
      ],
      name: "repayBorrowBehalf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "reserveFactorMantissa",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "liquidator", type: "address" },
        { internalType: "address", name: "borrower", type: "address" },
        { internalType: "uint256", name: "seizeTokens", type: "uint256" },
      ],
      name: "seize",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "supplyRatePerBlock",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalBorrows",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "totalBorrowsCurrent",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalReserves",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { internalType: "address", name: "src", type: "address" },
        { internalType: "address", name: "dst", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "underlying",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ],
  signer
);

const USDC = new ethers.Contract(
  "0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46",
  [
    {
      inputs: [
        {
          internalType: "string",
          name: "name",
          type: "string",
        },
        {
          internalType: "string",
          name: "symbol",
          type: "string",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
      ],
      name: "allowance",
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
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "approve",
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
          name: "account",
          type: "address",
        },
      ],
      name: "balanceOf",
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
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "subtractedValue",
          type: "uint256",
        },
      ],
      name: "decreaseAllowance",
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
          name: "spender",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256",
        },
      ],
      name: "increaseAllowance",
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
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
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
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transfer",
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
          name: "sender",
          type: "address",
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "transferFrom",
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
  ],
  signer
);

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

//@Author
/********************/
/* Main Body */
/********************/
async function main() {
  // console.log(await provider.getBalance(signer.getAddress()));

  // console.log("Deploying CompoundForksLiquidationBot contract");
  // const CompoundForksLiquidationBotFactory = await ethers.getContractFactory(
  //   "CompoundForksLiquidationBot"
  // );
  // const CompoundForksLiquidationBot =
  //   await CompoundForksLiquidationBotFactory.deploy(
  //     "0xb53c1a33016b2dc2ff3653530bff1848a515c8c5", //LendingPoolAddressesProvider
  //     "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", //Router
  //     // "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F", //Sushi Router
  //     "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //Weth,
  //     "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" //Factory
  //     // "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac" //Sushi Factory
  //   );
  // await CompoundForksLiquidationBot.deployed();
  // console.log(
  //   "Successfully deployed CompoundForksLiquidationBotFactory at address: "
  // );
  // console.log(CompoundForksLiquidationBot.address);
  // console.log("\n");

  // console.log(await provider.getBalance(signer.getAddress()));

  //
  // console.log("Deploying CompoundForksLiquidationBotV2 contract");
  // const CompoundForksLiquidationBotV2Factory = await ethers.getContractFactory(
  //   "CompoundForksLiquidationBotV2"
  // );
  // const CompoundForksLiquidationBotV2 =
  //   await CompoundForksLiquidationBotV2Factory.deploy(
  //     "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
  //     "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  //     "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  //     "0x1111111254fb6c44bAC0beD2854e76F90643097d"
  //   );
  // await CompoundForksLiquidationBotV2.deployed();
  // console.log(
  //   "Successfully deployed CompoundForksLiquidationBotV2 at address: "
  // );
  // console.log(CompoundForksLiquidationBotV2.address);
  // console.log("\n");
  // //

  // //
  // console.log("Deploying TestCompoundLiquidate contract");
  // const TestCompoundLiquidateFactory = await ethers.getContractFactory(
  //   "TestCompoundLiquidate"
  // );
  // const TestCompoundLiquidate = await TestCompoundLiquidateFactory.deploy();
  // await TestCompoundLiquidate.deployed();
  // console.log("Successfully deployed TestCompoundLiquidate at address: ");
  // console.log(TestCompoundLiquidate.address);
  // console.log("\n");
  //

  // await mine(500000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xf4d50e97Ee3cbC375F0cE5c8d1bdf1CCA5DEde19"
  //   )
  // );
  // const liquidationTxTest1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xf4d50e97Ee3cbC375F0cE5c8d1bdf1CCA5DEde19", //Borrower
  //   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //Flash Token To Borrow
  //   (39557n * 10n ** 18n) / 100000n, //Flash Loan Amount
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
  //   "0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46",
  //   false
  // );

  // await mine(230000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5"
  //   )
  // );
  // const liquidationTxTest2 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5",
  //   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //   4095000n * 10n ** 6n,
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB",
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB",
  //   false
  // );

  // await mine(3900000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x7B052756f8Cb2fDCD9DE2F1665D0D6648317346A"
  //   )
  // );
  // console.log(await provider.getBalance(signer.getAddress()));

  // const liquidationTxTest3 = await CompoundForksLiquidationBot.flashLiquidate(
  //   0,
  //   0,
  //   StrikeComptroller.address,
  //   "0x7B052756f8Cb2fDCD9DE2F1665D0D6648317346A", //Borrower
  //   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //Flash Token To Borrow
  //   // 35n * 10n ** 18n, //Flash Loan Amount
  //   100000000000000,
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
  //   true
  // );
  // // console.log(await liquidationTxTest3.wait());
  // console.log(await provider.getBalance(signer.getAddress()));
  // await mine(2300000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // // await MirrorCompoundForksLiquidationBot.callStatic._getBorrowBalance(
  // //   "0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602"
  // // );
  // // await mine(1);
  // // const tx = await MirrorCompoundForksLiquidationBot.flashLiquidate(
  // //   0,
  // //   20,
  // //   "0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B",
  // //   "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5",
  // //   "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  // //   0
  // // );
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5"
  //   )
  // );

  // await mine(5000000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x5ca9568930f61BA40d90F4D1707a93aB78DB6325"
  //   )
  // );
  // const liquidationTx5 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0x5ca9568930f61BA40d90F4D1707a93aB78DB6325",
  //   "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  //   1000n * 10n ** 18n,
  //   "0xf24A7D2077285E192Aa7dF957a4a699c144510d8",
  //   "0xf24A7D2077285E192Aa7dF957a4a699c144510d8",
  //   false
  // );

  // await mine(1000000000);
  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // // await CToken2.borrowBalanceCurrent(await signer.getAddress());
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x8cf877e91118ab50ff00de1e6e6a566c9c2b8228"
  //   )
  // );
  // const liquidationTx6 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0x8cf877e91118ab50ff00de1e6e6a566c9c2b8228", //Borrower
  //   "0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9", //Flash Token
  //   1000n * 10n ** 18n,
  //   "0xdBee1d8C452c781C17Ea20115CbaD0d5f627a680", //C Repay
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB", //C Seize
  //   false
  // );

  //@Weth to Weth
  // await mine(3800000);
  // const newCToken = new ethers.Contract(
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x7b052756f8cb2fdcd9de2f1665d0d6648317346a"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0x7b052756f8cb2fdcd9de2f1665d0d6648317346a", //Borrower
  //   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //Flash Token
  //   30n * 10n ** 18n,
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92", //C Repay
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92", //C Seize
  //   true
  // );
  // await newCToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x7b052756f8cb2fdcd9de2f1665d0d6648317346a"
  //   )
  // );

  // // @Uni to Uni
  // await mine(2000000);
  // const newCToken2 = new ethers.Contract(
  //   "0x280f76a218DDC8d56B490B5835e251E55a2e8F8d",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken2.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xdb32cf55306a78e32c825729bdf8e917bd328725"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xdb32cf55306a78e32c825729bdf8e917bd328725", //Borrower
  //   "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", //Flash Token
  //   1n * 10n ** 18n,
  //   "0x280f76a218DDC8d56B490B5835e251E55a2e8F8d", //C Repay
  //   "0x280f76a218DDC8d56B490B5835e251E55a2e8F8d", //C Seize
  //   false
  // );
  // await newCToken2.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xdb32cf55306a78e32c825729bdf8e917bd328725"
  //   )
  // );

  // // @USDT to USDT => Failed
  // await mine(600000);
  // const newCToken3 = new ethers.Contract(
  //   "0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken3.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xee2826453a4fd5afeb7ceffeef3ffa2320081268"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xee2826453a4fd5afeb7ceffeef3ffa2320081268", //Borrower
  //   "0xdAC17F958D2ee523a2206206994597C13D831ec7", //Flash Token
  //   4100000n * 10n ** 6n,
  //   "0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5", //C Repay
  //   "0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5", //C Seize
  //   false
  // );
  // await newCToken3.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xee2826453a4fd5afeb7ceffeef3ffa2320081268"
  //   )
  // );

  // // @USDC to USDC
  // await mine(300000);
  // const newCToken4 = new ethers.Contract(
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken4.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5", //Borrower
  //   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //Flash Token
  //   4000000n * 10n ** 6n,
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB", //C Repay
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB", //C Seize
  //   false
  // );
  // await newCToken4.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5"
  //   )
  // );

  // // // @BUSD to STRIKE => Failed Uniswap No Liquidity
  // await mine(200000000);
  // const newCToken5 = new ethers.Contract(
  //   "0x18A908eD663823C908A900b934D6249d4befbE44",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken5.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x79828E235f405E96fAe2F7279cBB7F8aEcb46DEc"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0x79828E235f405E96fAe2F7279cBB7F8aEcb46DEc", //Borrower
  //   "0x4Fabb145d64652a948d72533023f6E7A623C7C53", //Flash Token
  //   1000n * 10n ** 18n,
  //   "0x18A908eD663823C908A900b934D6249d4befbE44", //C Repay
  //   "0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46", //C Seize
  //   false
  // );
  // await newCToken5.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x79828E235f405E96fAe2F7279cBB7F8aEcb46DEc"
  //   )
  // );

  // @WETH to STRK
  //23228
  //8789
  // await mine(18000000);
  // const newCToken6 = new ethers.Contract(
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92",
  //   CToken.interface,
  //   signer
  // );
  // const newCToken7 = new ethers.Contract(
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB",
  //   CToken.interface,
  //   signer
  // );
  // await newCToken6.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // // await newCToken7.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x6d478cb16317680a517ff89253f82032efdc31ba"
  //   )
  // );
  // const tx1 = CompoundForksLiquidationBot.flashLiquidate(
  //   0,
  //   0,
  //   StrikeComptroller.address,
  //   "0x6d478cb16317680a517ff89253f82032efdc31ba", //Borrower
  //   "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", //Flash Token
  //   1n * 10n ** 18n,
  //   "0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92", //C Repay
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB", //C Seize
  //   false
  // );
  // await newCToken6.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("Liquidity after Liquidation:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x6d478cb16317680a517ff89253f82032efdc31ba"
  //   )
  // );

  // const liquidationTx = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5",
  //   "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //   4095000n * 10n ** 6n,
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB",
  //   "0x3774E825d567125988Fb293e926064B6FAa71DAB"
  // );

  // console.log(await USDC.balanceOf(CompoundForksLiquidationBot.address));

  // console.log(await CompoundForksLiquidationBot.CONTRACT_OWNER());
  // console.log(await provider.getBalance(signer.getAddress()));
  // console.log(await provider.getBalance(CompoundForksLiquidationBot.address));
  // await mine(1);

  //0xd026bfdb74fe1baf1e1f1058f0d008cd1eeed8b5
  //0xee2826453a4fd5afeb7ceffeef3ffa2320081268

  console.log("Current block is: " + (await provider.getBlockNumber()));
  const feeData = await provider.getFeeData();

  const userTestAddress = "0xeCA023e03127205dCa2F196B8b32bdD748203587";
  const bribe = 30;

  console.log("Liquidity:");
  console.log(await StrikeComptroller.getAccountLiquidity(userTestAddress));
  console.log(
    await CompoundForksLiquidationBotV2.getHealthFactor(
      StrikeComptroller.address,
      userTestAddress
    )
  );

  // await mine(71500);
  await CompoundForksLiquidationBotV2._updateAccountState(
    StrikeComptroller.address,
    userTestAddress
  );
  console.log(
    await CompoundForksLiquidationBotV2.callStatic._updateAccountState(
      StrikeComptroller.address,
      userTestAddress
    )
  );
  console.log("Liquidity:");
  console.log(await StrikeComptroller.getAccountLiquidity(userTestAddress));
  console.log(
    await CompoundForksLiquidationBotV2.getHealthFactor(
      StrikeComptroller.address,
      userTestAddress
    )
  );
  console.log(
    await CompoundForksLiquidationBotV2.callStatic.flashLiquidate(
      StrikeComptroller.address,
      userTestAddress,
      bribe
    )
  );
  const tx = await CompoundForksLiquidationBotV2.flashLiquidate(
    StrikeComptroller.address,
    userTestAddress,
    0,
    {
      // maxFeePerGas: feeData.maxFeePerGas * 1.5,
      // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2,
      maxFeePerGas: 20n * 10n ** 9n,
      gasLimit: 8000000,
    }
  );
  console.log(tx);
  console.log(await tx.wait());

  console.log("Liquidity:");
  console.log(await StrikeComptroller.getAccountLiquidity(userTestAddress));
  console.log(
    await CompoundForksLiquidationBotV2.getHealthFactor(
      StrikeComptroller.address,
      userTestAddress
    )
  );
  console.log(await provider.getBalance(signer.getAddress()));

  // await CToken.borrowBalanceCurrent(await signer.getAddress()); //Switch
  // console.log("New Liquidity:");
  // console.log(
  //   await StrikeComptroller.getAccountLiquidity(
  //     "0x5ca9568930f61BA40d90F4D1707a93aB78DB6325"
  //   )
  // );
  // const liquidationTx5 = CompoundForksLiquidationBot.flashLiquidate(
  //   1,
  //   0,
  //   StrikeComptroller.address,
  //   "0x5ca9568930f61BA40d90F4D1707a93aB78DB6325",
  //   "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  //   1000n * 10n ** 18n,
  //   "0xf24A7D2077285E192Aa7dF957a4a699c144510d8",
  //   "0xf24A7D2077285E192Aa7dF957a4a699c144510d8",
  //   false
  // );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
