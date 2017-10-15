import React, { Component } from 'react'
import getWeb3 from '../utils/getWeb3'

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
      var expenseContractInstance;

      this.state.web3.eth.getAccounts((error, accounts) => {
        console.log(accounts);
        expensesContract.at(this.props.match.params.expenseID).then(function(instance){
          //self.setState({expenseContract: instance});
          window.contractInstance = instance;
          console.log('expense contract', instance)
          return instance.getContractData();
          //return instance.state.call();
        }).then(function(data){
          console.log('data', data);
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
                  <label htmlFor="state">State</label>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={this.state.name}
                    onChange={e => this.updateField('name', e.target.value)}/>
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    name="description"
                    onChange={e => this.updateField('description', e.target.value)}
                    defaultValue={this.state.description}
                    style={{'resize': 'none'}}/>
                  <label htmlFor="limit">Limit</label>
                  <input
                    type="text"
                    name="limit"
                    onChange={e => this.updateField('limit', e.target.value)}
                    defaultValue={this.state.limit}/>
                  <label htmlFor="spenders">Spenders</label>
                  <input
                    type="text"
                    name="spenders"
                    onChange={e => this.updateAddresses('spenders', e.target.value)}
                    defaultValue={this.state.spenders}/>
                  <label htmlFor="funders">Funders</label>
                  <input
                    type="text"
                    name="funders"
                    onChange={e => this.updateAddresses('funders', e.target.value)}
                    defaultValue={this.state.funders}/>
                </fieldset>
                <Link to={`/view/${this.props.match.params.expenseID}/new-transaction`}><button className="pure-button pure-button-primary">New Transaction</button></Link>
                <button type="submit" className="pure-button pure-button-primary" onClick={e => this.submitProposal(e)}>Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default ViewExpenses
