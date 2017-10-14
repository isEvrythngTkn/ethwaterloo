pragma solidity ^0.4.4;

contract Expenses {

  bytes32 public name;
  bytes32 public description;
  uint public limitInCents;
  address[] public spenders;
  address[] private funders;
  bytes10 public state;
  
  bytes8 constant PROPOSED = "proposed";
  bytes6 constant ACTIVE = "active";
  bytes10 constant SETTLEMENT = "settlement";
  bytes6 constant CLOSED = "closed";

  struct Transaction {
    uint amountInCents;
    bytes32 transactionDescription;
    bytes3 currency;
    address spender;
  }

  // TRACK SOME EVENTS

  // Private variables are not private, so there.
  mapping (uint => Transaction) public transactions;
  mapping (address => bool) public proposalApprovals;
  mapping (address => bool) public settlementRequests;

  modifier isOneOf(address[] addresses) {
    bool proceed = false;
    for (uint i = 0; i < addresses.length; i++) {
      if (msg.sender == addresses[0]) {
        proceed = true;
      }
    }
    require(proceed);
    _;
  }

  modifier stateIs(bytes10 requiredState) {
    require(state == requiredState);
    _;
  }

  function Expenses(bytes32 _name, bytes32 _description, uint _limitInCents, address[] _spenders, address[] _funders) {
    name = _name;
    description = _description;
    limitInCents = _limitInCents;
    spenders = _spenders;
    funders = _funders;
    state = PROPOSED;
  } 

  function createTransaction(uint transactionID, uint amountInCents, bytes32 transactionDescription, bytes3 currency, address spender) 
    isOneOf(spenders) stateIs(ACTIVE) returns (bool)
    {
    Transaction memory transaction;
    transaction.amountInCents = amountInCents;
    transaction.transactionDescription = transactionDescription;
    transaction.currency = currency;
    transaction.spender = spender;
    transactions[transactionID] = transaction;
    return true;
  }

  function approve() isOneOf(funders) stateIs(PROPOSED) returns (bool) {
    proposalApprovals[msg.sender] = true;
    
    bool allApproved = true;

    for (uint i = 0; i < funders.length; i++) {
      if (!proposalApprovals[funders[i]]) {
        allApproved = false;
      }
    }
    
    return setState(allApproved, ACTIVE);
  }

  function requestSettlement() isOneOf(spenders) stateIs(ACTIVE) returns (bool) {
    settlementRequests[msg.sender] = true;

    bool allRequested = true;

    for (uint i = 0; i < spenders.length; i++) {
      if (!settlementRequests[spenders[i]]) {
        allRequested = false;
      }
    }
    return setState(allRequested, SETTLEMENT);
  }

  function setState(bool condition, bytes10 newState) internal returns (bool) {
    if (condition) {
      state = newState;
    }
    return true;
  }

  function disburse() isOneOf(funders) stateIs(SETTLEMENT) {
    // create a mapping of balance owing to each spender
    // loop through transactions 
    // 
  }
}
