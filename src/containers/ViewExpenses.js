import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

import ExpensesContract from '../../build/contracts/Expenses.json'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

var weiToUSD = 30000000000000000;

class ViewExpenses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      expenseContract: {},
      name: '',
      description: '',
      limit: 0,
      spender: '',
      funder: '',
      balance: 0,
      transactions: [],
      isFunder: false,
      isSpender: false
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      const self = this
      const contract = require('truffle-contract')
      const expensesContract = contract(ExpensesContract)
      expensesContract.setProvider(this.state.web3.currentProvider)
      var expenseContractInstance;

      this.state.web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
        expensesContract.at(this.props.match.params.expenseID).then(function(instance){
          //self.setState({expenseContract: instance});
          window.contractInstance = instance;
          expenseContractInstance = instance;
          console.log('expense contract', instance)
          return expenseContractInstance.getContractData();
          //return instance.state.call();
        }).then(function(data){
          console.log(data);
          self.setState({
            name: self.state.web3.utils.hexToString(data[0]),
            state: self.state.web3.utils.hexToString(data[1]),
            description: self.state.web3.utils.hexToString(data[2])
          });
          return expenseContractInstance.limitInCents();
        }).then(function(data) {
          console.log(data);
          self.setState({limit: data.toNumber()});
          return expenseContractInstance.funders();
        }).then(function(data){
          if (self.state.web3.utils.toChecksumAddress(data) == self.state.web3.utils.toChecksumAddress(accounts[0])) {
            self.setState({isFunder: true});
          }
          self.setState({funder: data});
          return expenseContractInstance.spenders();
        }).then(function(data) {
          if (self.state.web3.utils.toChecksumAddress(data) == self.state.web3.utils.toChecksumAddress(accounts[0])) {
            self.setState({isSpender: true});
          }
          self.setState({spender: data});
          return self.state.web3.eth.getBalance(expenseContractInstance.address);
        }).then(function(balance){
          self.setState({balance: balance});
        });
      });

      expensesContract.at(this.props.match.params.expenseID).then(function(instance){
        self.setState({expenseContract: instance})
        return instance.transactionsCount();
      }).then(function(transCount){
        for(var i = 0; i < transCount.toNumber(); i++) {
          self.state.expenseContract.getTransactionData(i)
          .then((data) => {
            self.setState({transactions: [{amount: data[0].toNumber(), description: self.state.web3.utils.hexToString(data[1])}, ...self.state.transactions]})
          })
        }
      });
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  fundContract(e) {
    e.preventDefault();
    const self = this
    const contract = require('truffle-contract')
    const expensesContract = contract(ExpensesContract)
    expensesContract.setProvider(this.state.web3.currentProvider)
    var expenseContractInstance;

    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log(accounts);
      expensesContract.at(self.props.match.params.expenseID).then(function(instance){
        expenseContractInstance = instance;
        var weiToSend = self.state.limit * weiToUSD
        return expenseContractInstance.fund({from: accounts[0], value: weiToSend});
      }).then((result) => {
        self.setState({state: 'active'});
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Header/>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <legend>Information</legend>
                  Name: {this.state.name}<br/>
                  State: {this.state.state}<br/>
                  Description: {this.state.description}<br/>
                  Limit: {this.state.limit}<br/>
                  Spender: {this.state.spender}<br/>
                  Funders: {this.state.funder}<br/>
                  Balance: {this.state.balance}<br/>
                  { this.state.isFunder && this.state.state == 'proposed' ? <button className="fund-contract"  onClick={e => this.fundContract(e)}>Fund Contract</button> : ''}
                  { this.state.isFunder ? <button className="disburse-contract">Disburse Contract</button> : ''}
                </fieldset>
                <ul>
                  {this.state.transactions.map((transaction, index) => {
                    return <li key={index}>Amount: {transaction.amount} - Description: {transaction.description}</li>
                  })}
                </ul>
                <Link to={`/view/${this.props.match.params.expenseID}/new-transaction`}><button className="pure-button pure-button-primary">New Transaction</button></Link>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default ViewExpenses
