const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeed;
  if (developmentChains.includes(network.name)) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeed = ethUsdAggregator.address;
  } else {
    ethUsdPriceFeed = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  const fundMeArgs = [ethUsdPriceFeed];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: fundMeArgs,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("------------01 end------------");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("start verify");
    await verify(fundMe.address, fundMeArgs);
    log("-------------verify end-------------");
  }
};
module.exports.tags = ["all", "fundme"];
