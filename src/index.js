import React from 'react'
import ReactDOM from 'react-dom'
import ListExpenses from './containers/ListExpenses'
import NewExpenses from './containers/NewExpenses'
import ViewExpenses from './containers/ViewExpenses'

import { BrowserRouter, Switch, Route } from 'react-router-dom'


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={ListExpenses}/>
      <Route path='/new' component={NewExpenses}/>
      <Route path='/view/:expenseID' component={ViewExpenses}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
