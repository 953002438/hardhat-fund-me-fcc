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
      accounts: [
        "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0",
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
