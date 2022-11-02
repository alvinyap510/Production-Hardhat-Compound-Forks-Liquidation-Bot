require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");

const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET || "0xSomething";

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://nothing.com";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: MAINNET_RPC_URL,
        // blockNumber: 15736000,
      },
      // allowUnlimitedContractSize: true,
    },
    mainnet: {
      // url: MAINNET_RPC_URL,
      url: "https://mainnet.infura.io/v3/abba306146314bb28c4e9b51e7392799",
      accounts: [PRIVATE_KEY_MAINNET],
      chainID: 1,
      allowUnlimitedContractSize: true,
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [PRIVATE_KEY_MAINNET],
      chainID: 97,
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            runs: 200,
            enabled: true,
          },
          viaIR: true,
        },
      },
    ],
  },
};
