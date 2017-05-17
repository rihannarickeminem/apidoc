'use strict';

import express from 'express';
import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import debug from 'debug';
import { vendor } from '../controllers';
import error from '../errors';
import validators from '../middleware/validators';
import Purchase from '../models/purchases';
import * as ctM from '../controllers/consts';
import * as erCt from '../errors/consts';

Promise.promisifyAll(fs);
// eslint-disable-next-line no-unused-vars
const log = debug('server:VENDOR ROUTER');
const route = new express.Router();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

function wrap(genFn) {
  const cr = Promise.coroutine(genFn);
  return (req, res, next) => {
    cr(req, res, next).catch(next);
  };
}
function checkDirectory(Path) {
  return new Promise(resolve => {
    fs.accessAsync(Path, fs.constants.R_OK | fs.constants.W_OK, (noPath) => {
      if (noPath) {
        fs.access(
      path.join(__dirname, '../../server'),
      fs.constants.R_OK | fs.constants.W_OK,
      (canWritErr) => {
        if (canWritErr) {
          resolve(ctM.NO_ACCESS);
        } else {
          resolve(ctM.NEED_TO_CREATE_REQUIRED_FOLDER);
        }
      });
      } else {
        resolve(ctM.IS_ACCESS);
      }
    });
  });
}

/**
 * @api {get} /ownlists get own shopping lists
 * @apiName Get Own Shop Lists
 * @apiGroup Shopping List
 *
 * @apiParam {Number} page page of own shop lists.
 * @apiParam {Number} limit shop lists per page limit.
 *
 * @apiSuccess {Object} ownlists object with vendor's shop lists.
 *
 * @apiError ShoppingListErr, VendorError.
 *
 */
route
  .get('/ownlists', wrap(function* ownl(req, res) {
    let page = 1;
    let limit = 15;
    if (typeof req.body.limit !== 'undefined') {
      limit = req.body.limit;
    }
    if (typeof req.body.page !== 'undefined') {
      page = req.body.page;
    }
    const ownlists = yield vendor.ownlists(req.user._id, page, limit);
    return res.status(200).json({
      ownlists,
    });
  }))
/**
 * @api {post} /upload_image upload image
 * @apiName Upload Image
 * @apiGroup Shopping List
 *
 * @apiParam {String} path path to image.
 *
 * @apiSuccess {String} tempPath temp image path.
 * @apiSuccess {String} newPath new image path,
 * that will be sent in array of pics url inside product object .
 *
 * @apiError ShoppingListErr, VendorError.
 *
 */
  .post('/upload_image',
  multipartMiddleware,
  wrap(validators.uploadImage),
  wrap(function* uploadImage(req, res) {
    const Path = path.join(__dirname, '../picpath/');
    /* eslint-disable */
    // const newName = `${req.files.file.name.slice(0, 4)}${Date.now()}.${req.files.file.type.slice(6)}`;
    const newName = req.files.file.name.slice(0, 4) + Date.now() + '.' + req.files.file.type.slice(6);
    /* eslint-enable */
    const newPath = Path + newName;
    const exist = yield checkDirectory(Path);
    if (exist === ctM.NEED_TO_CREATE_REQUIRED_FOLDER) {
      yield vendor.createFolder(Path);
    } else if (exist === ctM.NO_ACCESS) {
      throw new error.CustomServerError(ctM.NO_RIGHTS_FOR_WRITING_IN_FOLDER);
    }
    yield vendor.resavePic(req.files.file.path, newPath);
    res.status(200).json({
      tempPath: req.files.file.path,
      newPath,
    });
  }))
/**
 * @api {post} /createp Create shopping list with products
 * @apiName Create Shopping List
 * @apiGroup Shopping List
 *
 * @apiParam {Object} shoplist object with shop list information in it.
 * @apiParam {String} shoplist.purchaseTitle shopping list title.
 * @apiParam {String} shoplist.description shopping list description.
 * @apiParam {String} shoplist.purchaseCategory shopping list Category.
 * @apiParam {Number} shoplist.finishingDate shopping list finishing date.
 * @apiParam {String} shoplist.condition shopping list finishing condition,
 * equals to one of model consts [ModelsCt.SHOPPING_CONDITION_MEMBERS, ModelsCt.SHOPPING_CONDITION_AMOUNT].
 * @apiParam {Number} shoplist.conditionValue shopping list finishing conditionValue.
 *
 * @apiParam {Array} products shopping list products.
 * @apiParam {String} products[0].productName product name.
 * @apiParam {String} products[0].productCode product code, max 5 symbols.
 * @apiParam {String} products[0].description product description.
 * @apiParam {Boolean} products[0].integer shopping list finishing date.
 * @apiParam {Number} products[0].price product's price.
 * @apiParam {Number} products[0].availableCount available products.
 * @apiParam {Array} products[0].pictures array with product pictures, max 5 pics.
 *
 * @apiSuccess {String} message success message.
 * @apiSuccess {Object} theSL object with created shopping list .
 *
 * @apiError ShoppingListErr, VendorError.
 *
 */
  .post('/createp', wrap(validators.createp), wrap(function* createp(req, res) {
    const products = req.data.products;
    const shoplist = req.data.shoplist;
    shoplist.vendor = req.session.user._id;
    const ProductsIds = [];
    yield Promise.each(products, (product =>
    vendor.saveProduct(product)
      .then(r =>
      ProductsIds.push(r._id)
    )
  )).catch((err) => {
    console.log('errr', err.message);
    throw new error.VendorError(erCt.SAVE_PRODUCT_ERR + err.message);
  });
    yield vendor.createp(ProductsIds, shoplist).then((theSL) => {
      return res.status(200).json({
        message: ctM.SHOPPING_LIST_CREATED,
        theSL,
      });
    }).catch((err) => {
      console.log('errr', err);
      throw new error.VendorError(erCt.CREATE_SHOP_LIST_ERR + err.message);
    });
  }))
/**
 * @api {put} /slist/:id Edit shopping list info
 * @apiName Edit Shopping List
 * @apiGroup Shopping List
 *
 * @apiParam {String} id shopping list document id to edit. It's In url params.
 * @apiParam {Object} shoplist shopping list info object.
 * @apiParam {String} shoplist.purchaseTitle shopping list title.
 * @apiParam {String} shoplist.description shopping list description.
 * @apiParam {String} shoplist.purchaseCategory shopping list Category.
 * @apiParam {Number} shoplist.finishingDate shopping list finishing date.
 * @apiParam {String} shoplist.condition shopping list finishing condition.
 * @apiParam {Number} shoplist.conditionValue shopping list finishing conditionValue.
 *
 * @apiSuccess {String} message success message.
 *
 * @apiError VendorError, SL_EDIT_ERR.
 *
 */
  .put('/slist/:id', wrap(validators.editPurchase), wrap(function* editSl(req, res) {
    yield vendor.editShopList({ _id: req.params.id }, req.data)
    .then(() => (
    res.status(200).json({
      message: ctM.SL_EDITED,
    })
  )).catch(() => {
    throw new error.VendorError(erCt.SL_EDIT_ERR);
  });
  }))
/**
 * @api {delete} /slist/:id Remove shopping list by id
 * @apiName REMOVE Shopping List
 * @apiGroup Shopping List
 *
 * @apiParam {String} id shopping list document id to remove, request url parameter.
 *
 * @apiSuccess {Object} message success message.
 *
 * @apiError VendorError, REMOVE_SL_ER.
 *
 */
  .delete('/slist/:id', wrap(function* deleteSl(req, res) {
    yield vendor.removeShopList(req.params.id).then(() => (
    res.status(200).json({
      message: ctM.SHOPPING_LIST_REMOVED,
    })
  )).catch(() => {
    throw new error.VendorError(erCt.REMOVE_SL_ER);
  });
  }))
/**
 * @api {delete} /slist/:id/:product_id Remove product by its id
 * @apiName REMOVE Product by ID
 * @apiGroup Shopping List
 *
 * @apiParam {String} id shopping list id, url parameter.
 * @apiParam {String} product_id product id, url parameter.
 *
 * @apiSuccess {String} message success message.
 *
 * @apiError VendorError, REMOVE_PRODUCT_ER, RM_PR_ER_AT_LEAST_ONE.
 *
 */
  .delete('/slist/:id/:product_id', wrap(function* deleteProduct(req, res) {
    const sl = yield Purchase.findOne({ _id: req.params.id })
    .catch(() => {
      throw new error.VendorError(erCt.PURCHASE_FIND_ERR);
    });
    if (--sl.productsIDs.length < 1) {
      throw new error.VendorError(erCt.RM_PR_ER_AT_LEAST_ONE);
    }
    yield vendor.removeProduct(req.params.product_id)
    .then(() => (
    res.status(200).json({
      message: ctM.PRODUCT_REMOVED,
    })
    )).catch(() => {
      throw new error.VendorError(erCt.REMOVE_PRODUCT_ER);
    });
  }))
  // .delete('/slist/:id/:product_id:t_id/:t_id', wrap(function* deleteProduct(req, res) {
  //     res.status(200).json({
  //     message: ctM.PRODUCT_REMOVED,
  //     })
  // }))
/**
 * @api {put} /slist/:id/:product_id Edit product by its id
 * @apiName EDIT Product by ID
 * @apiGroup Shopping List
 *
 * @apiParam {String} id shopping list id, url parameter.
 * @apiParam {String} product_id product id, url parameter.
 * @apiParam {Object} product object with new product parameters.
 *
 * @apiSuccess {String} message success message.
 *
 * @apiError VendorError, PRODUCT_EDIT_ERR, EDIT_PRODUCT_FAIL_SL_VAL.
 *
 */
  .put('/slist/:id/:product_id', validators.editProduct, wrap(function* editProduct(req, res) {
    yield vendor.editProduct({ _id: req.params.product_id }, req.product)
    .then(() =>
      res.status(200).json({
        message: ctM.PRODUCT_EDITED,
      })
    ).catch(() => {
      throw new error.VendorError(erCt.PRODUCT_EDIT_ERR);
    });
  }));

export default route;
