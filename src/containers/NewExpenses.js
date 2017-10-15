import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import getWeb3 from '../utils/getWeb3'
import Header from '../components/Header'

import ExpensesFactoryContract from '../../build/contracts/ExpensesFactory.json'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class NewExpenses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      contractInstance: {},
      newAddress: '',
      name: '',
      description: '',
      funders: [],
      spenders: [],
      limit: 0,
      formIsValid: false
    }
  }

  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  updateField(key, value) {
    this.setState({[key]: value})
  }

  updateAddresses(key, value) {
    let addresses = value.split(' ').join('')
    addresses = addresses.split(',')
    addresses = addresses.filter(address => address !== '')
    this.setState({[key]: addresses})
  }

  submitProposal(e) {
    e.preventDefault()
    this.createExpenses()
  }

  createExpenses() {
    const self = this
    const contract = require('truffle-contract')
    const expensesFactoryContract = contract(ExpensesFactoryContract)
    expensesFactoryContract.setProvider(this.state.web3.currentProvider)

    this.state.web3.eth.getAccounts((error, accounts) => {
      expensesFactoryContract.deployed().then((instance) => {
        self.setState({contractInstance: instance})
        return instance.createContract.call(this.state.name, this.state.description, this.state.limit, this.state.spenders, this.state.funders, {from: accounts[0]})
      }).then((result) => {
        self.setState({newAddress: result})
        return self.state.contractInstance.createContract(this.state.name, this.state.description, this.state.limit, this.state.spenders, this.state.funders, {from: accounts[0]})
      }).then((result) => {
        self.props.history.push(`/view/${self.state.newAddress}`)
      })
    })
  }

  validate(name, description, limit, funders, spenders) {
    return {
      name: name.length < 1,
      description: description.length < 1,
      limit: limit < 1,
      funders: funders.length < 1,
      spenders: spenders.length < 1
    }
  }

  render() {
    const errors = this.validate(this.state.name, this.state.description, this.state.limit, this.state.funders, this.state.spenders)
    const isEnabled = !Object.keys(errors).some(x => errors[x]);

    return (
      <div className="App">
        <Header/>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <legend>Information</legend>
                  <label htmlFor="state">State</label>
                  <input type="text" placeholder="Proposal" name="state" readOnly/>
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
                <button type="submit" className="pure-button pure-button-primary" onClick={e => this.submitProposal(e)} disabled={!isEnabled}>Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(NewExpenses)
