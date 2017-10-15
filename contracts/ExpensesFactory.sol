pragma solidity ^0.4.4;

import "./Expenses.sol";

contract ExpensesFactory {
  address[] public newContracts;
  bytes32[] public contractNames;

  function createContract(bytes32 name, bytes32 description, uint limitInCents, address spenders, address funders) returns (address){
    address newContract = new Expenses(name, description, limitInCents, spenders, funders);
    newContracts.push(newContract);
    contractNames.push(name);

    return newContract;
  }

  function getContracts() constant returns (address[]) {
    return newContracts;
  }

  function getContractNames() constant returns (bytes32[]) {
    return contractNames;
  }

  function() {} // Can't send ether
}
