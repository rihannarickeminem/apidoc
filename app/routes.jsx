import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from 'containers/App';
import Vote from 'containers/Vote';
import About from 'containers/About';
import LoginOrRegister from 'containers/LoginOrRegister';
import Dashboard from 'containers/Dashboard';
import NoMatch from 'components/NoMatch';
import CreateShopListContainer from 'containers/createShopListContainer';
import Landing from 'containers/Landing';
import { fetchShopListRequest } from './actions/shoplist';
// import ShoppingList from 'containers/ShoppingList';

/*
 * @param {Redux Store}
 * We require store as an argument here because we wish to get
 * state from the store after it has been authenticated.
 */
export default (store) => {
  const requireAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (!authenticated) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  };

  const redirectAuth = (nextState, replace, callback) => {
    const { user: { authenticated }} = store.getState();
    if (authenticated) {
      replace({
        pathname: '/'
      });
    }
    callback();
  };
  // const setEditingState = (nextState, replace, callback) => {
  //   const props = store.getState();
  //   props.shoplist.isEditing = true;
  //   callback();
  // }
  const fetchShopList = (nextState, replace, callback) => {
    const props = store.getState();
    store.dispatch(fetchShopListRequest(nextState.location.pathname.split('/')[1]));
    callback();
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Landing} />
      <Route path="login" component={LoginOrRegister} onEnter={redirectAuth} />
      <Route path="dashboard" component={Dashboard} onEnter={requireAuth} />
      <Route path="createp" component={CreateShopListContainer} onEnter={requireAuth} />
      <Route path="shoppinglist/:id" onEnter={requireAuth} component={CreateShopListContainer} />
      <Route path="*" component={NoMatch}/>
    </Route>
  );
};
