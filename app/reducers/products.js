import * as types from 'types';
import crypto from 'crypto';

function TheProduct(theCode) {
  this.base64 = crypto.randomBytes(64).toString('base64');
  this.TheProductCode = theCode || this.base64.substr(2, 5);
  this.defaultCode = this.TheProductCode.substr(0, 5);
  this.ProductNameId = `product-name_${this.TheProductCode}`;
  this.ProductCodeId = `product-code_${this.TheProductCode}`;
  this.ProductDescriptionId = 'product-description_' + this.TheProductCode;
  this.priceID = 'product-price_' + this.TheProductCode;
  this.isIntegerID = 'product-isinteger_' + this.TheProductCode;
  this.availableCountID = 'product-available-count_' + this.TheProductCode;
  this.paramsToSend = {
    productName: '',
    productCode: this.TheProductCode,
    description: '',
    integer: true,
    price: Number,
    availableCount: Number,
    pictures: [],
  };
}

const initialState = [];

export default function products(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_PRODUCT:
      return [...state, new TheProduct()];
    case types.DELETE_NEW_PRODUCT:
      return state.filter((product) => product.defaultCode !== action.defaultCode);
    case types.CHANGE_PRODUCT_CODE:
      state.find((product, i) => {
        if (product.defaultCode === action.product.defaultCode) {
          return Object.assign(state[i], new TheProduct(action.newCode));
        }
        return state;
      });
      return state;
    default:
      return state;
  }
}
