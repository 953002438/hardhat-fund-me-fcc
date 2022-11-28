const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("start funding...");
  const response = await fundMe.fund({
    value: ethers.utils.parseEther("0.5"),
  });
  await response.wait(1);

  console.log("funded...");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
