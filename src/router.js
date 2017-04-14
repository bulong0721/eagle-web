import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import App from './views/index';
import Dashboard from './views/dashboard/index';
import Manager from './views/manager/index'

export default function ({ history, app }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="/dashboard" />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/users" tableName="user" component={Manager} />
        <Route path="/manager" tableName="test" component={Manager} />
      </Route>
    </Router>
  );
}