pragma solidity ^0.4.4;

import "./Expenses.sol";

contract ExpensesFactory {
  address[] public newContracts;

  function createContract(bytes32 name, bytes32 description, uint limitInCents, address spenders, address funders) external {
    address newContract = new Expenses(name, description, limitInCents, spenders, funders);
    newContracts.push(newContract);
  }

  function getContracts() constant returns (address[]) {
    return newContracts;
  }

  function() {} // Can't send ether
}
