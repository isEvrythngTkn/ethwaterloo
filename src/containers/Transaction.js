import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { Link, withRouter } from 'react-router-dom';

import ExpensesContract from '../../build/contracts/Expenses.json'


class Transaction extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      expenseContract: {},
      amount: 0,
      description: '',
      contract: ''
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

      expensesContract.at(this.props.match.params.expenseID).then(function(instance){
        self.state.expenseContract = instance;
        console.log('expense contract', self.state.expenseContract)
      });
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  createTransaction(e) {
    e.preventDefault()
    var self = this;
    this.state.web3.eth.getAccounts((error, accounts) => {
      self.state.expenseContract.createTransaction(self.state.amount, self.state.description, {from: accounts[0]})
      .then((result) => {
        self.props.history.push(`/view/${self.props.match.params.expenseID}`);
      })
      .catch((err) => {
        console.log(err)
      });
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Expense Report #001</Link>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <legend>Transaction</legend>
                  <label htmlFor="amount">Amount</label>
                  <input type="text" name="amount" defaultValue={this.state.amount} onChange={e => this.setState({amount: e.target.value})}/>
                  <label htmlFor="description">Description</label>
                  <input type="text" name="description" defaultValue={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                </fieldset>
                <button type="submit" className="pure-button pure-button-primary" onClick={e => this.createTransaction(e)}>Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Transaction)
