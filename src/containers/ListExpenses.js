import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

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
      contractInstance: {},
      expenses: [],
      expensesNames: []
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
          self.setState({contractInstance: instance})
          return instance.getContracts.call({from: accounts[0]})
        }).then((result) => {
          self.setState({expenses: result})
          return self.state.contractInstance.getContractNames.call({from: accounts[0]})
        }).then((result) => {
          var names = result.map((name) => {
            return self.state.web3.utils.hexToString(name)
          })
          self.setState({expensesNames: names})
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
        <Header/>

        <main className="container">
          <div className="list-view pure-g">
            {this.state.expenses.map((expense, index) => {
              return <div className="pure-u-1-1 expense-link" key={index}><Link to={`/view/${expense}`}><button className="pure-button pure-button-primary">{this.state.expensesNames[index]}</button></Link></div>
            })}
            <div className="pure-u-1-1 expense-link"><Link to="/new"><button className="pure-button pure-button-primary">New Expense Report</button></Link></div>
          </div>
        </main>
      </div>
    );
  }
}

export default ListExpenses
