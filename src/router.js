import React from 'react';
import { Router, Route, IndexRedirect } from 'dva/router';
import App from './views/index';
import Dashboard from './views/dashboard/index';
import Manager from './views/manager/index'
import OrderAdd from './views/pickup/orderadd'

export default function ({ history, app }) {
  return (
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRedirect to="/dashboard" />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/pickup/add" component={OrderAdd} />
        <Route path="/pickup/order" tableName="user" component={Manager} />
        <Route path="/pickup/sign" tableName="test" component={Manager} />

        <Route path="/base/partner" tableName="test" component={Manager} />
        <Route path="/base/vehicle" tableName="test" component={Manager} />
        <Route path="/base/track" tableName="test" component={Manager} />
        <Route path="/base/receipt" tableName="test" component={Manager} />

        <Route path="/report/simple" tableName="test" component={Manager} />
        <Route path="/report/payment" tableName="test" component={Manager} />
        <Route path="/report/waybill" tableName="test" component={Manager} />
        <Route path="/report/transport" tableName="test" component={Manager} />
        <Route path="/report/profit" tableName="test" component={Manager} />

        <Route path="/settle/statement" tableName="test" component={Manager} />
        <Route path="/settle/cash" tableName="test" component={Manager} />
        <Route path="/settle/revenue" tableName="test" component={Manager} />
        <Route path="/settle/expense" tableName="test" component={Manager} />

        <Route path="/system/client" tableName="test" component={Manager} />
        <Route path="/system/organization" tableName="test" component={Manager} />
        <Route path="/system/employee" tableName="test" component={Manager} />
        <Route path="/system/account" tableName="test" component={Manager} />
      </Route>
    </Router>
  );
}