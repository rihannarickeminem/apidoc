import { combineReducers } from 'redux';
import user from 'reducers/user';
// import topic from 'reducers/topic';
import message from 'reducers/message';
import category from 'reducers/category';
import shoplist from 'reducers/shoplist';
import products from 'reducers/products';
import { routerReducer as routing } from 'react-router-redux';

// Combine reducers with routeReducer which keeps track of
// router state
const rootReducer = combineReducers({
  user,
  products,
  shoplist,
  // topic,
  message,
  category,
  routing,
});

export default rootReducer;
