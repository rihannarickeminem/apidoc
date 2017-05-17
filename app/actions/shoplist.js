import { polyfill } from 'es6-promise';
import request from 'axios';
import { push } from 'react-router-redux';
import * as types from 'types';

polyfill();

let errCreateSL = ' Oops! Something went wrong and we couldn\'t create your shopping list . ';
export function makeShopListRequest(method, id, data, api = '/user/vendor/ownlists') {
  return request[method](api + (id ? ('/' + id) : ''), data);
}

export function fetchShopListRequest(id) {
  return {
    type: types.GET_SHOPLIST,
    promise: makeShopListRequest('get', id, '', '/user/shoppinglist')
  };
}
export function createShopListRequest(data) {
  console.log('createShopListRequest   ', data);
  return {
    type: types.CREATE_SHOPLIST_REQUEST,
    products: data.products,
    shoplist: data.shoplist,
  };
}

export function createShopListSuccess() {
  return {
    type: types.CREATE_SHOPLIST_SUCCESS
  };
}

export function createShopListFailure(data) {
  return {
    type: types.CREATE_SHOPLIST_FAILURE,
    message: data.error
  };
}

// export function createShopListDuplicate() {
//   return {
//  type: types.CREATE_SHOPLIST_DUPLICATE
//   };
// }

export function createShopList(data) {
  return (dispatch) => {
    // If the text box is empty
    // if (text.trim().length <= 0) return;

    // const id = md5.hash(text);
    // Redux thunk's middleware receives the store methods `dispatch`
    // and `getState` as parameters
    // const { topic } = getState();
    // const data = {
    //   count: 1,
    //   id,
    //   text
    // };

    // Conditional dispatch
    // If the topic already exists, make sure we emit a dispatch event
    // if (topic.topics.filter(topicItem => topicItem.id === id).length > 0) {
    //   // Currently there is no reducer that changes state for this
    //   // For production you would ideally have a message reducer that
    //   // notifies the user of a duplicate topic
    //   return dispatch(createShopListDuplicate());
    // }

    // First dispatch an optimistic update
    dispatch(createShopListRequest(data));
    return makeShopListRequest('post', '', data, '/user/vendor/createp')
      .then(res => {
        if (res.status === 200) {
          dispatch(createShopListSuccess());
          return dispatch(push(`shoppinglist/${res.data.theSL._id}`));
        }
        return dispatch(createShopListFailure({ error: errCreateSL }));
      })
      .catch((err) => {
        console.log('ERROR ! ', err);
        errCreateSL = typeof err.response !== 'undefined' && typeof err.response.data !== 'undefined' ? errCreateSL + err.response.data.err : errCreateSL;
        return dispatch(createShopListFailure({ error: errCreateSL }));
      });
  };
}
