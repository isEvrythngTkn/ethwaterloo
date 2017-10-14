import React, { Component } from 'react'

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'

class Expenses extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isNew: true,
      name: '',
      description: '',
      funders: [],
      spenders: [],
      limit: 0
    }
  }

  updateField(key, value) {
    this.setState({[key]: value})
  }

  updateNumberField(key, value) {
    if(isNaN(value))
      return false
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
    console.log(this.state)
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
              <form className="pure-form pure-form-stacked">
                <fieldset>
                  <legend>Information</legend>
                  <label htmlFor="state">State</label>
                  <input type="text" placeholder="Proposal" name="state" readOnly/>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    name="name"
                    readOnly={!this.state.isNew}
                    defaultValue={this.state.name}
                    onChange={e => this.updateField('name', e.target.value)}/>
                  <label htmlFor="description">Description</label>
                  <textarea
                    type="text"
                    name="description"
                    readOnly={!this.state.isNew}
                    onChange={e => this.updateField('description', e.target.value)}
                    defaultValue={this.state.description}
                    style={{'resize': 'none'}}/>
                  <label htmlFor="limit">Limit</label>
                  <input
                    type="text"
                    name="limit"
                    onChange={e => this.updateField('limit', e.target.value)}
                    readOnly={!this.state.isNew}
                    defaultValue={this.state.limit}/>
                  <label htmlFor="spenders">Spenders</label>
                  <input
                    type="text"
                    name="spenders"
                    onChange={e => this.updateAddresses('spenders', e.target.value)}
                    readOnly={!this.state.isNew}
                    defaultValue={this.state.spenders}/>
                  <label htmlFor="funders">Funders</label>
                  <input
                    type="text"
                    name="funders"
                    onChange={e => this.updateAddresses('funders', e.target.value)}
                    readOnly={!this.state.isNew}
                    defaultValue={this.state.funders}/>
                </fieldset>
                <button type="submit" className="pure-button pure-button-primary" onClick={e => this.submitProposal(e)}>Submit</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Expenses
