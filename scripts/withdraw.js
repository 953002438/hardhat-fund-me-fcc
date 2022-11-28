const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("start withdraw...");
  const response = await fundMe.withdraw();
  await response.wait(1);

  console.log("withdraw done...");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
