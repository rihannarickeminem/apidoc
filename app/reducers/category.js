import * as types from 'types';
import { combineReducers } from 'redux';
const isFetching = (
  state = false,
  action
) => {
  switch (action.type) {
    case types.GET_CATEGORIES_REQUEST:
      return true;
    case types.GET_CATEGORIES_SUCCESS:
      return 'fetched';
    case types.GET_CATEGORIES_FAILURE:
      return false;
    default:
      return state;
  }
};
const categories = (
  state = {},
  action
) => {
  switch (action.type) {
    case types.GET_CATEGORIES_REQUEST:
      return {};
    case types.GET_CATEGORIES_SUCCESS:
      // return {...state,
      // categories: action.res.data
      // };
      return action.res.data;
    case types.GET_CATEGORIES_FAILURE:
      return {};
    default:
      return state;
  }
};

const categoryReducer = combineReducers({
  categories,
  isFetching,
});

export default categoryReducer;
