var ExpensesFactory = artifacts.require("./ExpensesFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(ExpensesFactory);
};
