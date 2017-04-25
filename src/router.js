import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import App from './views/index';
import Dashboard from './views/dashboard/index';
import Manager from './views/manager/index'

export default function ({ history, app }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="/dashboard/dashboard" />
        <Route path="/dashboard/dashboard" component={Dashboard} />
        <Route path="/dashboard/alert" tableName="alert" component={Manager} />
        <Route path="/monitor/device" tableName="user" component={Manager} />
      </Route>
    </Router>
  );
}