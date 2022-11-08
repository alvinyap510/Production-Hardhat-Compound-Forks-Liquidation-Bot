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
  await signer.sendTransaction({
    chainId: await provider.getNetwork().chainId,
    type: 2,
    maxFeePerGas: feeData.maxFeePerGas * 1.5,
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2,
    gasLimit: 8000000,
    value: 0,
    data:
      "0x8615c7a3000000000000000000000000e2e17b2cbbf48211fa7eb8a875360e5e39ba2602000000000000000000000000" +
      userTestAddress.slice(2) +
      "0000000000000000000000000000000000000000000000000000000000000014",
    to: "0xa8d15de0cF2a7f6e3BfD3f68b6EdC6b0b946d6a6",
  });
  // const tx = await CompoundForksLiquidationBotV2.flashLiquidate(
  //   StrikeComptroller.address,
  //   userTestAddress,
  //   0,
  //   {
  //     // maxFeePerGas: feeData.maxFeePerGas * 1.5,
  //     // maxPriorityFeePerGas: feeData.maxPriorityFeePerGas * 2,
  //     maxFeePerGas: 20n * 10n ** 9n,
  //     gasLimit: 8000000,
  //   }
  // );
  // console.log(tx);
  // console.log(await tx.wait());

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
