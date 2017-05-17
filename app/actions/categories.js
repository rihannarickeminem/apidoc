import { polyfill } from 'es6-promise';
import request from 'axios';

import * as types from 'types';

polyfill();

/*
 * Utility function to make AJAX requests using isomorphic fetch.
 * You can also use jquery's $.ajax({}) if you do not want to use the
 * /fetch API.
 * @param Object Data you wish to pass to the server
 * @param String HTTP method, e.g. post, get, put, delete
 * @param String endpoint - defaults to /login
 * @return Promise
 */
function makeCategoriesRequest(method, id, data, api = '/user/getslcategories') {
  console.log('method data apo', method, data, api);
 // return request[method](api, data);
  // return instance[method](api + (id ? ('/' + id) : ''), data);
  return request[method](api + (id ? ('/' + id) : ''), data);
}

export function fetchCategories() {
  return {
    type: types.GET_CATEGORIES,
    promise: makeCategoriesRequest('get')
  };
}
export default fetchCategories;
// export function FetchAsyncCategories() {
//   return (dispatch) => {
//     dispatch({ type: types.GET_CATEGORIES_REQUEST });

//     return requestSomething().then(
//       (result) => dispatch({ type: types.GET_CATEGORIES_SUCCESS, result }),
//       (error) => dispatch({ type: types.GET_CATEGORIES_FAILURE, error })
//     );
//   };
// }
// export function getShopListError(message) {
//   return {
//     type: types.LOAD_CATEGORIES_ERROR,
//     message
//   };
// }

// function receiveCategories(categories) {
//   return {
//     type: types.LOAD_CATEGORIES_SUCCESS,
//     categories
//   };
// }

// function requestCategories() {
//   return {
//     type: types.GET_CATEGORIES
//   }
// }

// export function getShopListsCategories() {
//   return dispatch => {
//     // return makeShopListReq('get', '', '/user/get-sl-categories')
//     dispatch(requestCategories())
//     return request['get']('/user/get-sl-categories','')
//     .then(response => {
//       console.log('response!!!!!', response);
//       console.log('response!!!!!', response);
//       console.log('response!!!!!', response);
//       console.log('response!!!!!', response);
//       if (response.status === 200) {
//         console.log('response.data.categories ', response.data.categories);
//         dispatch(receiveCategories(response.data.categories));
//       } else {
//         dispatch(getShopListError('Oops! Something went wrong'));
//       }
//     })
//     .catch(err => {
//       console.log('get shop list errror ', err);
//       dispatch(getShopListError(err.response.data.err));
//     });
//   };
// }
// export default {
//  fetchCategories,
// };
