const { assert, expect } = require("chai");
const { deployments, getNamedAccounts, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", function () {
      let fundMe, deployer, mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;

        await deployments.fixture(["all"]);

        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
      });

      describe("constructor", function () {
        it("sets the aggregator address correctly", async () => {
          const priceFeed = await fundMe.getPriceFeed();
          assert.equal(priceFeed, mockV3Aggregator.address);
        });
      });

      describe("fund", function () {
        it("Failes if you dont spend enough Eth", async () => {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more Eth!"
          );
        });
        it("should update the amount success", async () => {
          await fundMe.fund({ value: sendValue });
          const amount = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(sendValue.toString(), amount.toString());
        });
        it("should update the funders success", async () => {
          await fundMe.fund({ value: sendValue });
          const sender = await fundMe.getFunders(0);
          assert.equal(sender, deployer);
        });
      });

      describe("withdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
          await fundMe.fund({ value: sendValue });
        });

        it("amount should be zero", async () => {
          await fundMe.withdraw();
          const amount = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(amount.toString(), "0");
        });
        it("total amount should be right", async () => {
          await withdrawAndCheckBanlance();
        });

        it("withdraw with muti funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 0; i <= 5; i++) {
            const fundMeContract = await ethers.getContract(
              "FundMe",
              accounts[i].address
            );
            await fundMeContract.fund({ value: sendValue });
          }
          await withdrawAndCheckBanlance();
        });

        it("only allows deployer to withdraw", async () => {
          const accounts = await ethers.getSigners();
          const fundMeContract = await ethers.getContract(
            "FundMe",
            accounts[1].address
          );
          await expect(fundMeContract.withdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });

        async function withdrawAndCheckBanlance() {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const tranctionResponse = await fundMe.withdraw();
          const tranctionReceipt = await tranctionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = tranctionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
          await expect(fundMe.getFunders()).to.be.reverted;
        }
      });

      describe("cheaperWithdraw", () => {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
          await fundMe.fund({ value: sendValue });
        });

        it("amount should be zero", async () => {
          await fundMe.cheaperWithdraw();
          const amount = await fundMe.getAddressToAmountFunded(deployer);
          assert.equal(amount.toString(), "0");
        });
        it("total amount should be right", async () => {
          await cheaperWithdrawAndCheckBanlance();
        });

        it("cheaperWithdraw with muti funders", async () => {
          const accounts = await ethers.getSigners();
          for (let i = 0; i <= 5; i++) {
            const fundMeContract = await ethers.getContract(
              "FundMe",
              accounts[i].address
            );
            await fundMeContract.fund({ value: sendValue });
          }
          await cheaperWithdrawAndCheckBanlance();
        });

        it("only allows deployer to cheaperWithdraw", async () => {
          const accounts = await ethers.getSigners();
          const fundMeContract = await ethers.getContract(
            "FundMe",
            accounts[1].address
          );
          await expect(fundMeContract.cheaperWithdraw()).to.be.revertedWith(
            "FundMe__NotOwner"
          );
        });

        async function cheaperWithdrawAndCheckBanlance() {
          const startingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          const tranctionResponse = await fundMe.cheaperWithdraw();
          const tranctionReceipt = await tranctionResponse.wait(1);
          const { gasUsed, effectiveGasPrice } = tranctionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);

          const endingFundMeBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );
          assert.equal(endingFundMeBalance.toString(), "0");
          assert.equal(
            startingFundMeBalance.add(startingDeployerBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
          await expect(fundMe.getFunders()).to.be.reverted;
        }
      });
    });
