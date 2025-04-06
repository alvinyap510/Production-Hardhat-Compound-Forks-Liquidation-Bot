# Compound Forks Liquidator

## Introduction

This is an early project of mine that went into production, and actually made a bit of profit in the early days by liquidating unhealthy positions on Compound & Compound forks.

Due to the increasing competitiveness of the MEV / Liquidation sceneary, this liquidation bot is no longer profitable anymore.

Thought to set this repo to public so that people can review the code base and get something useful out of it.

PS: This is an early project in my programming journey, and wasn't meant to be public at first, so bear with me on the somewhat unorganized codebase and the lack of unit testing.

## Tech Used

- Smart Contracts: Solidity
- Build Tool / Development Environment: Hardhat
- Backend: Ethers.js
- Relayer: Flashbots

## Key Concepts

- Hardhat

  - Hardhat as a Solidity development environment
  - Hardhat's ability to fork a mainnet state and fast-forward it into future for code testing

- Lending Protocol

  - How lending protocols work
  - Lending protocol's price feeds, health factors and how liquidation works

- Flashloan

  - How flashloan works
  - Source of flashloans (This project uses AaveV2, and UniswapV2's Forks)
  - Calling flashloan and executing transactions in the same block, and how flashloan was called back by source

- Flashbots
  - Concept of MEV & searcher
  - Flashbot relayer
  - How to use bundler, sign transctions and simulate the outcome of the transaction
