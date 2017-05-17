import * as types from 'types';
import { combineReducers } from 'redux';

const initialState = {};

const isFetchingSL = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.GET_SHOPLIST_REQUEST:
      return true;
    case types.GET_SHOPLIST_SUCCESS:
    case types.GET_SHOPLIST_FAILURE:
      return false;
    default:
      return state;
  }
};
const isEditing = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.SHOPLIST_CUSTOM:
    case types.CREATE_SHOPLIST_SUCCESS:
      return false;
    case types.SHOPLIST_IS_EDITING:
    case types.SHOPLIST_IS_CREATING:
      return true;
    default:
      return state;
  }
};
const shoplist = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case types.CREATE_SHOPLIST_REQUEST:
      return {
        products: action.products,
        shoplist: action.shoplist,
      };
    case types.GET_SHOPLIST_SUCCESS:
      return action.res.data;
    case types.CREATE_SHOPLIST_SUCCESS:
      return {};
    case types.CREATE_SHOPLIST_FAILURE:
      return {};
    default:
      return state;
  }
};

const shoplistReducer = combineReducers({
  shoplist,
  isEditing,
  isFetchingSL,
});

export default shoplistReducer;
