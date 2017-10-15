pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';

contract Expenses {

  // CONTRACT PROPOSAL VARS
  bytes32 public name;
  bytes32 public description;
  uint public limitInCents;
  address public spenders;
  address public funders;
  bytes10 public state;
  uint public transactionsCount;

  // POTENTIAL CONTRACT STATES
  bytes8 constant PROPOSED = "proposed";
  bytes6 constant ACTIVE = "active";
  bytes10 constant SETTLEMENT = "settlement";
  bytes6 constant CLOSED = "closed";

  // SAI TOKEN CONTRACTS
  address private saiKovan = 0x228BF3D5BE3ee4b80718b89b68069b023c32131E;
  address private saiMainnet = 0x59aDCF176ED2f6788A41B8eA4c4904518e62B6A4;

  // HELPER TOTAL SO WE DON'T NEED TO COMPUTE LATER
  uint public totalAmountInCents;

  struct Transaction {
    uint amountInCents;
    bytes32 transactionDescription;
    bytes3 currency;
    address spender;
  }

  // TRACK SOME EVENTS
  event TransactionCreated (
    uint indexed transactionID,
    uint amountInCents,
    bytes32 transactionDescription,
    address spender
  );

  mapping (uint => Transaction) private transactions;

  ///////////// MODIFIERS //////////////

  modifier isFunded() {
    bool funded = false;
    if (state == ACTIVE) {
      funded = true;
    } else {
      ERC20Basic saiContract = ERC20Basic(saiKovan);
      if (saiContract.balanceOf(this) > 0) {
        funded = true;
        setState(ACTIVE);
      }
    }
    require(funded);
    _;
  }

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

  ////////// FUNCTIONS ///////////

  function Expenses(bytes32 _name, bytes32 _description, uint _limitInCents, address _spenders, address _funders) {
    name = _name;
    description = _description;
    limitInCents = _limitInCents;
    spenders = _spenders;
    funders = _funders;
    state = PROPOSED;
    transactionsCount = 0;
  }

  function createTransaction(uint amountInCents, bytes32 transactionDescription) isFunded returns (bool) {
    Transaction memory transaction;
    uint transactionID = transactionsCount;
    transactionsCount += 1;
    transaction.amountInCents = amountInCents;
    transaction.transactionDescription = transactionDescription;
    transaction.spender = msg.sender;
    transactions[transactionID] = transaction;

    totalAmountInCents += amountInCents;

    TransactionCreated(transactionID, amountInCents, transactionDescription, msg.sender);

    return true;
  }

  function requestSettlement() stateIs(ACTIVE) returns (bool) {
    require(msg.sender == spenders);
    return setState(SETTLEMENT);
  }

  function setState(bytes10 newState) internal returns (bool) {
    state = newState;
    return true;
  }

  function disburse() stateIs(SETTLEMENT) {
    require(msg.sender == funders);
    ERC20Basic saiContract = ERC20Basic(saiKovan);
    require(saiContract.balanceOf(this) >= totalAmountInCents);

    saiContract.transfer(spenders, totalAmountInCents);
  }

  function getContractData() public constant returns (bytes32, bytes10, bytes32) {
    return (name, state, description);
  }

  function getTransactionData(uint _transactionID) constant returns (uint, bytes32) {
    return (transactions[_transactionID].amountInCents, transactions[_transactionID].transactionDescription);
  }
}
