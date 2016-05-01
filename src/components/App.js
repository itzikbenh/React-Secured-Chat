import React from 'react';
import { render } from 'react-dom';
import thunkMiddleware  from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';

import Register from './register';
import Rooms from './rooms';
import Room from './room';
import Update from './update';
import Update_password from './update_password';
import Login from './login';
import Welcome from './welcome';
import Template from './app-template';
import { verifyUserToken } from '../actions/index';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware)
);

export default () => {
  const requireLogin = () => {
    store.dispatch(verifyUserToken("securedRoutes"));
  }
  return (
      <Provider store={store}>
        <Router history={hashHistory}>
          <Route path="/" component={ Template } >
            <IndexRoute component={ Welcome } />
            <Route path="/login" component={ Login } />
            <Route path="/register" component={ Register } />
            <Route path="/rooms" component={ Rooms } onEnter={requireLogin} />
            <Route path="/rooms/:room" component={ Room } />
            <Route path="/update" component={ Update } onEnter={requireLogin} />
            <Route path="/updatepassword" component={ Update_password } onEnter={requireLogin} />
          </Route>
        </Router>
      </Provider>
  );
}
