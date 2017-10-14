pragma solidity ^0.4.4;

contract Expenses {

  bytes32 public name;
  bytes32 public description;
  uint public limitInCents;
  address[] public spenders;
  address[] private funders;

  struct Transaction {
    uint amountInCents;
    bytes32 transactionDescription;
    bytes3 currency;
    address spender;
  }

  mapping (uint => Transaction) transactions;

  function Expenses(bytes32 _name, bytes32 _description, uint _limitInCents, address[] _spenders, address[] _funders) {
    name = _name;
    description = _description;
    limitInCents = _limitInCents;
    spenders = _spenders;
    funders = _funders;
  } 

  function createTransaction(uint transactionID, uint amountInCents, bytes32 transactionDescription, bytes3 currency, address spender) {
    Transaction memory transaction;
    transaction.amountInCents = amountInCents;
    transaction.transactionDescription = transactionDescription;
    transaction.currency = currency;
    transaction.spender = spender;
    transactions[transactionID] = transaction;
  }
}
