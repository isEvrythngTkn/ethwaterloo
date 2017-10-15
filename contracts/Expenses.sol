pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/ERC20Basic.sol';

contract Expenses {

  // CONTRACT PROPOSAL VARS
  bytes32 public name;
  bytes32 public description;
  uint public limitInCents;
  address[] public spenders;
  address[] private funders;
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

  // HELPER TOTALS SO WE DON'T NEED TO COMPUTE LATER
  uint public totalAmountInCents;
  uint public totalAmountInSAI;

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

  // Private variables are not private, so no point?
  mapping (uint => Transaction) private transactions;
  mapping (address => bool) public proposalApprovals;
  mapping (address => bool) public settlementRequests;
  mapping (address => uint) public spentPerSpender;

  ///////////// MODIFIERS //////////////

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

  function Expenses(bytes32 _name, bytes32 _description, uint _limitInCents, address[] _spenders, address[] _funders) {
    name = _name;
    description = _description;
    limitInCents = _limitInCents;
    spenders = _spenders;
    funders = _funders;
    state = PROPOSED;
    transactionsCount = 0;
    // change for the sake of change
  }

  function createTransaction(uint amountInCents, bytes32 transactionDescription) returns (bool) {
    Transaction memory transaction;
    uint transactionID = transactionsCount;
    transactionsCount += 1;
    transaction.amountInCents = amountInCents;
    transaction.transactionDescription = transactionDescription;
    transaction.spender = msg.sender;
    transactions[transactionID] = transaction;

    totalAmountInCents += amountInCents;

    spentPerSpender[msg.sender] += amountInCents;

    TransactionCreated(transactionID, amountInCents, transactionDescription, msg.sender);

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
    ERC20Basic saiContract = ERC20Basic(saiKovan);
    require(saiContract.balanceOf(this) >= totalAmountInSAI);

    for (uint i = 0; i < spenders.length; i++) {
      saiContract.transfer(spenders[i], spentPerSpender[spenders[i]]);
    }
  }

  function getContractData() public constant returns (bytes32, bytes10, bytes32, uint, address[], address[]) {
    return (name, state, description, limitInCents, spenders, funders);
  }

  function getTransactionData(uint _transactionID) constant returns (uint, bytes32) {
    return (transactions[_transactionID].amountInCents, transactions[_transactionID].transactionDescription);
  }
}
