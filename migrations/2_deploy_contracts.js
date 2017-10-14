var Expenses = artifacts.require("./Expenses.sol");
var ExpensesFactory = artifacts.require("./ExpensesFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(Expenses);
  deployer.deploy(ExpensesFactory);
};
