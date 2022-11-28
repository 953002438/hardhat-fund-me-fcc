const { assert } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat");

const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("staging test", () => {
      let fundMe, deployer;
      const sendValue = ethers.utils.parseEther("0.05");

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;

        fundMe = await ethers.getContract("FundMe", deployer);
      });

      it("allows people to fund and withdraw", async () => {
        await fundMe.fund({ value: sendValue });
        await fundMe.withdraw();
        const endingFundMeBalance = await fundMe.provider.getBalance(
          fundMe.address
        );
        assert(endingFundMeBalance.toString(), "0");
      });
    });
