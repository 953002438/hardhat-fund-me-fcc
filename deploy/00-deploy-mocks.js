const { network } = require("hardhat");
const {
  developmentChains,
  DECIMAL,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("local network detected! start mocking...");
    await deploy("MockV3Aggregator", {
      from: deployer,
      contract: "MockV3Aggregator",
      log: true,
      args: [DECIMAL, INITIAL_ANSWER],
      skipIfAlreadyDeployed: false,
    });
    log("mocks deployed!");
    log("--------------00 end-------------------");
  }
};

module.exports.tags = ["all", "mocks"];
