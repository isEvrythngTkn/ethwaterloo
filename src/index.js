import React from 'react'
import ReactDOM from 'react-dom'
import ListExpenses from './containers/ListExpenses'
import NewExpenses from './containers/NewExpenses'
import ViewExpenses from './containers/ViewExpenses'
import Transaction from './containers/Transaction'

import { BrowserRouter, Switch, Route } from 'react-router-dom'


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={ListExpenses}/>
      <Route exact path='/new' component={NewExpenses}/>
      <Route exact path='/view/:expenseID' component={ViewExpenses}/>
      <Route path='/view/:expenseID/new-transaction' component={Transaction}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
