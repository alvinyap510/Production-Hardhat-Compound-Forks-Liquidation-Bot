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
        blockNumber: 15836320,
      },
    },
    mainnet: {
      url: MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY_MAINNET],
      chainID: 1,
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
