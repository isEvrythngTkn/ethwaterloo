import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { Link } from 'react-router-dom'

import ExpensesContract from '../../build/contracts/Expenses.json'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class ViewExpenses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      expenseContract: {},
      name: '',
      description: '',
      limit: 0,
      spenders: '',
      funders: '',
      balance: 0,
      transactions: []
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
      //var expenseContractInstance;

      this.state.web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
        expensesContract.at(this.props.match.params.expenseID).then(function(instance){
          //self.setState({expenseContract: instance});
          window.contractInstance = instance;
          console.log('expense contract', instance)
          return instance.getContractData();
          //return instance.state.call();
        }).then(function(data){
          console.log(data[3]);
          self.setState({
            name: self.state.web3.utils.hexToString(data[0]),
            state: self.state.web3.utils.hexToString(data[1]),
            description: self.state.web3.utils.hexToString(data[2]),
            limit: data[3].toNumber(),
            spenders: data[4],
            funders: data[5]
          })
        });
      });
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Expense Report #{this.props.match.params.expenseID}</a>
        </nav>

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
                  Spenders: {this.state.spenders}<br/>
                  Funders: {this.state.funders}<br/>
                </fieldset>
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
