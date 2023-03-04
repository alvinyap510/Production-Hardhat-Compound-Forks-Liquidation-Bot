require("dotenv").config();

const { providers, Wallet, ethers, utils } = require("ethers");
const {
  FlashbotsBundleProvider,
  FlashbotsBundleResolution,
} = require("@flashbots/ethers-provider-bundle");
const { mine } = require("@nomicfoundation/hardhat-network-helpers");

//Constants
const GWEI = 10n ** 9n;
const ETHER = 10n ** 18n;

const provider = new providers.JsonRpcProvider({
  url: process.env.MAINNET_PUBLIC_ANKR_RPC_URL,
});

const CHAIN_ID = 1;

const FLASHBOTS_ENDPOINT = "https://relay.flashbots.net";
const signer = new Wallet(process.env.PRIVATE_KEY_MAINNET, provider);

const authPrivateKey =
  // "0x12332112345671233211234567ffffffff0000000000000000123321123321ff";
  "0x8905100000000000000000000000000000000000000000000000000000000000";
//   "0x8888888888888888888888888888888888888888888888888888888888888888";
// "0x5201314000000000000000000000000000000000000000000000000000000000";

const authSigner = new Wallet(authPrivateKey);
// const authSigner = Wallet.createRandom();

// const body =
//   '{"jsonrpc":"2.0","method":"eth_sendBundle","params":[{see above}],"id":1}';
// const signature = wallet.address + ":" + wallet.signMessage(utils.id(body));

// console.log(signature);

async function main() {
  const flashbot = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    FLASHBOTS_ENDPOINT
  );
  console.log(await authSigner.getAddress());
  console.log(await flashbot.getUserStats());
}

main();
