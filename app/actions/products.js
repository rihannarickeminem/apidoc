import * as types from 'types';

export const createProduct = (productsLength) => {
  let pLength = productsLength;
  if (++pLength > 5) {
    return {
      type: types.PRODUCTS_LENGTH,
      message: 'max 5 products',
    };
  }
  return {
    type: types.CREATE_PRODUCT,
  };
};
export const changeProductCode = (product, newCode) => {
  if (newCode.length !== 5) {
    return {
      type: types.PRODUCT_CODE_LENGTH,
      message: 'Product"s code length must be 5 characters long ',
    };
  }
  if (newCode.length === 5) {
    return {
      type: types.CHANGE_PRODUCT_CODE,
      newCode,
      product,
    };
  }
  return null;
};
export const deleteProduct = (defaultCode, productsLength) => {
  let pLength = productsLength;
  if (--pLength < 1) {
    return {
      type: types.PRODUCTS_LENGTH,
      message: 'required at least one product',
    };
  }
  return {
    type: types.DELETE_NEW_PRODUCT,
    defaultCode,
  };
};
