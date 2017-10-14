import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { Link } from 'react-router-dom'

import ExpensesFactoryContract from '../../build/contracts/ExpensesFactory.json'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class ListExpenses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      expenses: []
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
      const expensesFactoryContract = contract(ExpensesFactoryContract)
      expensesFactoryContract.setProvider(this.state.web3.currentProvider)
      this.state.web3.eth.getAccounts((error, accounts) => {
        expensesFactoryContract.deployed().then((instance) => {
          return instance.getContracts.call({from: accounts[0]})
        }).then((result) => {
          self.setState({expenses: result})
        })
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Expense Report #001</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <ul>
                {this.state.expenses.map((expense) => {
                  return <li key={expense}><Link to={`/edit/${expense}`}>{expense}</Link></li>
                })}
                <li><Link to='/new'>New</Link></li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default ListExpenses
