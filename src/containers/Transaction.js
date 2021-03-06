import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { withRouter } from 'react-router-dom';
import Header from '../components/Header'

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
        <Header/>
        <main className="container">
          <div className="pure-g view-view">
            <div className="pure-u-1-3">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <legend>New Transaction</legend>
                  <label htmlFor="amount">Amount in Cents</label>
                  <input  className="pure-input-1" type="text" name="amount" defaultValue={this.state.amount} onChange={e => this.setState({amount: e.target.value})}/>
                  <label htmlFor="description">Description</label>
                  <input className="pure-input-1" type="text" name="description" defaultValue={this.state.description} onChange={e => this.setState({description: e.target.value})}/>
                </fieldset>
                <div style={{'textAlign': 'right'}}><button type="submit" className="pure-button pure-button-primary" onClick={e => this.createTransaction(e)}>Submit</button></div>
              </form>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default withRouter(Transaction)
