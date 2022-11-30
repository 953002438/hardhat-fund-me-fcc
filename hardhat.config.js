require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";

module.exports = {
  // solidity: "0.8.17",
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
      blockConfirmations: 6,
      chainId: 5,
    },
    localhost: {
      url: "HTTP://127.0.0.1:8545",
      // accounts: [
      //   "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
      // ],
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: [
        "2f98c687c2a0cb861e0da4460ed821ee704d77c9d33df9d6ac81e26a65aa250f",
        "f4c532e77e006f7e2854dd069dff9eaecb63921c9187bf4f8701d586665b9263",
        "490c665feb370223cc71f25ba42d1511065fe0b92d2112da162eb38e30afd9ac",
        "cd96bbedb3aac0423340b5c51cad83d577a6a4ddf8ffe0f32397fa5e452b2d54",
        "1ba86149bf368b5e074e62dff59d44f1dadc1b1b5a16a6b9ee1bc349a1032331",
        "325ce45ce35b7a9617143f8e91f77e44add269afbc67c203f81cca38a9cea379",
      ],
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
  etherscan: {
    apiKey: "ETHERSCAN_API_KEY",
  },
  gasReporter: {
    enabled: false,
    outPutFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    // coinmarketcap: COINMARKETCAP_API_KEY,
    token: "ETH",
  },
};
