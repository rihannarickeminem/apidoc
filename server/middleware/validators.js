'use strict';

import debug from 'debug';
import inspector from 'schema-inspector';
import Promise from 'bluebird';

import error from '../errors';
import * as ct from '../errors/consts';
import * as ModelsCt from '../models/consts';
import * as veC from './const';
import Product from '../models/product';
import Purchase from '../models/purchases';
// eslint-disable-next-line no-unused-vars
const log = debug('server:VALIDATORS');

const validator = {};

validator.uploadImage = function* uploadImage(req, res, next) {
  const validation = {
    type: 'object',
    properties: {
      type: { type: 'string',
    eq: ['image/jpeg', 'image/png', 'image/gif'],
    error: ct.SL_INVALID_PIC_EXT,
    },
      path: { type: 'string', error: ct.SL_INVALID_PIC_PATH },
    },
  };

  const resultUploadImage = inspector.validate(validation, req.files.file);

  if (!resultUploadImage.valid) {
    throw (new error.ShoppingListErr(ct.SL_ADD_PIC_ERROR + resultUploadImage.error[0].message));
  }
  next();
};

validator.editProduct = ((req, res, next) => {
  const product = req.body.product;

  const productInfoEditValidation = {
    type: 'object',
    properties: {
      productName: { type: 'string', optional: true },
      description: { type: 'string', optional: true },
      integer: { type: 'boolean', optional: true },
      price: { type: 'number', optional: true },
      availableCount: { type: 'number', optional: true },
      pictures: {
        type: 'array',
        maxLength: 5,
        optional: true,
        items: { type: 'string', optional: true },
      },
    },
  };
  const resultValEditProduct = inspector.validate(productInfoEditValidation, product);
  if (!resultValEditProduct.valid) {
    next(new error.ShoppingListErr(ct.EDIT_PRODUCT_FAIL_SL_VAL));
  }
  Object.assign(req, { product });
  next();
});

validator.editPurchase = function* editPurchase(req, res, next) {
  const shoplist = req.body.shoplist;

  const slInfoEditValidation = {
    type: 'object',
    properties: {
      purchaseTitle: { type: 'string', optional: true },
      description: { type: 'string', optional: true },
      purchaseCategory: { type: 'string', optional: true },
      finishingDate: { type: 'number', optional: true },
      condition: { type: 'string', optional: true },
      conditionValue: { type: 'number', optional: true },
    },
  };
  const resultValEditPurchase = inspector.validate(slInfoEditValidation, shoplist);
  if (!resultValEditPurchase.valid) {
    throw (new error.ShoppingListErr(ct.EDIT_SHOP_LIST_FAIL_SL_VAL));
  }
  Object.assign(req, { data: {} });
  Object.keys(shoplist).forEach(sl => {
    Object.assign(req.data,
      {
        [sl]: shoplist[sl],
      }
  );
  });
  next();
};
validator.createp = function* createpCr(req, res, next) {
  const slInfoValidation = {
    type: 'object',
    properties: {
      purchaseTitle: { type: 'string' },
      description: { type: 'string' },
      purchaseCategory: { type: 'string' },
      finishingDate: { type: 'number' },
      condition: { type: 'string', eq: [ModelsCt.SHOPPING_CONDITION_MEMBERS, ModelsCt.SHOPPING_CONDITION_AMOUNT] },
      conditionValue: { type: 'number' },
    },
  };
  const shoplist = req.body.shoplist;
  const products = req.body.products;
  const sanitization = {
    type: 'object',
    properties: {
      purchaseTitle: { type: 'string', rules: ['trim'] },
      description: { type: 'string', rules: ['trim'] },
      conditionValue: { type: 'number', rules: ['trim', 'lower'] },
    },
  };
  inspector.sanitize(sanitization, shoplist);

  const resultValShoplist = inspector.validate(slInfoValidation, shoplist);
  if (!resultValShoplist.valid) {
    throw (new error.ShoppingListErr(ct.CREATE_SHOP_LIST_FAIL_SL_VAL +
      ' Property ' + resultValShoplist.error[0].property + ' ' +
      resultValShoplist.error[0].message));
  }
  if (products.length < 1) {
    throw (new error.ShoppingListErr(ct.CREATE_SHOP_LIST_FAIL_PRODUCTS_LENGTH));
  }
  const validationProduct = {
    type: 'Array',
    properties: {
      productName: { type: 'string', minLength: 5 },
      productCode: { type: 'string', maxLength: 5 },
      description: { type: 'string', optional: true },
      integer: { type: 'boolean', optional: true },
      price: { type: 'number' },
      availableCount: { type: 'number' },
      pictures: {
        type: 'array',
        maxLength: 5,
        optional: true,
        items: { type: 'string', optional: true },
      },
    },
  };
  const sanitizationProduct = {
    type: 'object',
    properties: {
      productName: { type: 'string', rules: ['trim'] },
      productCode: { type: 'string', rules: ['trim'], maxLength: 5 },
    },
  };
  yield Promise.map(products, (product => {
    inspector.sanitize(sanitizationProduct, product);
    const resultValProduct = inspector.validate(validationProduct, product);
    if (!resultValProduct.valid) {
      return Promise.reject(resultValProduct);
    }
    return ('!');
  }))
  .catch(productValid => {
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    log('productValid & ?????  ', productValid);
    throw (
    // eslint-disable-next-line prefer-template
    new error.ShoppingListErr(ct.CREATE_SHOP_LIST_FAIL_SL_VAL +
      'Property ' +
      productValid.error[0].property.substring(2) + ' ' +
      productValid.error[0].message));
  });
  Object.assign(req, { data: {} });
  Object.assign(req.data, {
    products,
    shoplist,
  });
  next();
};

validator.joinsl = function* joinsl(req, res, next) {
  let amount = 0;
  const validation = {
    type: 'object',
    properties: {
      products: { type: 'object', error: veC.JOINSL_REQUIRED_PARAMS_ERR },
      slInfo: { type: 'object', error: veC.JOINSL_REQUIRED_PARAMS_ERR },
      stripeToken: { type: 'string', error: veC.JOINSL_REQUIRED_PARAMS_ERR },
    },
  };

  const resultValJoinSL = inspector.validate(validation, req.body);

  if (!resultValJoinSL.valid) {
    throw (new error.ShoppingListErr(ct.JOIN_SHOP_LIST_FAIL + resultValJoinSL.error[0].message));
  }

  const sl = yield Purchase.findOne({ _id: req.body.slInfo._id });

  if (sl.status.closed || sl.status.failed || (sl.finishingDate < Date.now())) {
    throw (new error.ShoppingListErr(ct.SL_FAILED_OR_FINISHED));
  }
  const products = yield Product.find({ _id: { $in: Object.keys(req.body.products) } });
  // const currentProducts = products;

  products.forEach((prod, i) => {
    const reqOunt = req.body.products[Object.keys(req.body.products)[i]];
  // prod.availableCount = products[i].availableCount - reqOunt;
    Object.assign(prod, { availableCount: products[i].availableCount - reqOunt });
    if (prod.availableCount < 0) {
      throw (new error.ShoppingListErr(ct.JOIN_SHOP_LIST_FAIL + ct.JOIN_SL_FAIL_PRODUCT_COUNT));
    }
    amount += prod.price * reqOunt;
  });
  const reqProducts = req.body.products;
  const stripeToken = req.body.stripeToken;
  Object.assign(req, { data: {} });
  Object.assign(req.data, {
    amount,
    products,
    sl,
    reqProducts,
    stripeToken,
  });
  next();
};

validator.ssign = ((req, res, next) => {
  const data = req.body;
  const sanitization = {
    type: 'object',
    properties: {
      email: { type: 'string', pattern: 'email', rules: ['trim', 'lower'] },
    },
  };
  inspector.sanitize(sanitization, data);
  const validation = {
    type: 'object',
    properties: {
      email: { type: 'string', pattern: 'email' },
      password: { type: 'string', minLength: 8, error: ct.PASS_LENGTH },
      passwordagain: { type: 'string', eq: data.password, error: ct.PASS_MATCH },
      role: { type: 'string', optional: true, eq: [ModelsCt.ENUM_VENDOR] },
    },
  };
  const resultValSsign = inspector.validate(validation, data);
  if (!resultValSsign.valid) {
    return next(new error.AuthError(ct.SIGNUP_VALIDATION_FAIL + resultValSsign.error[0].message));
  }
  return next();
});

validator.reset_pass = ((req, res, next) => {
  const data = req.body;
  const sanitization = {
    type: 'object',
    properties: {
      email: { type: 'string', pattern: 'email', rules: ['trim', 'lower'] },
    },
  };
  inspector.sanitize(sanitization, data);
  const validation = {
    type: 'object',
    properties: {
      email: { type: 'string', pattern: 'email' },
    },
  };
  const resultResetPass = inspector.validate(validation, data);
  if (!resultResetPass.valid) {
    return next(new error.ResetPassErr(ct.RESET_PASS_EMAIL_REQUIRED));
  }

  Object.assign(req, { reset_mail: data.email });
  return next();
});

export default validator;
