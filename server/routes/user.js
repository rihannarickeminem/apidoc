'use strict';
import express from 'express';
import Promise from 'bluebird';
import debug from 'debug';
import sadminroute from './sadminroute.js';
import adminroute from './adminroute.js';
import vendor from './vendor.js';
import { user } from '../controllers';
import Categories from '../models/purchaseCategories';
import Purchase from '../models/purchases';
import Product from '../models/product';
import User from '../models/user';
import validators from '../middleware/validators';
import * as rouTct from './consts';
import error from '../errors';
import * as erCt from '../errors/consts';

const route = new express.Router();
const checkIfSuperAdmin = require('../middleware/checkIfSuperAdmin').default;
const checkIfAdmin = require('../middleware/checkIfAdmin').default;
const checkIfVendor = require('../middleware/CheckIfVendor').default;
// eslint-disable-next-line no-unused-vars
const log = debug('server:router:USER');

function wrap(genFn) {
  const cr = Promise.coroutine(genFn);
  return (req, res, next) => cr(req, res, next).catch(next);
}

route
  /**
   * @api {get} /user/shoplists/ returns existing shopping lists and their categories
   *
   * @apiName  get Users purchases
   *
   * @apiGroup ShopList
   *
   * @apiParam {Number} page.
   * @apiParam {Number} limit.
   * @apiParam {Number} filter parameter to filter by shopping lists categories.
   *
   * @apiSuccess {Object} sl contains existing shopping lists.
   * @apiSuccess {Object} categories feild with shop lists categories.
   *
   * @apiError ShoppingListErr GET_SHOPPING_LISTS_ERROR.
   *
   */
  .get('/shoplists', wrap(function* slget(req, res) {
    const filter = {};
    let page = 1;
    let limit = 15;
    if (typeof req.body.limit !== 'undefined') {
      limit = req.body.limit;
    }
    if (typeof req.body.page !== 'undefined') {
      page = req.body.page;
    }
    if (typeof req.body.filter !== 'undefined') {
      filter.purchaseCategory = req.body.filter;
    }
    const categories = yield Categories.find({});
    yield user.getshoppinglists(filter, page, limit)
      .catch(() => {
        throw new error.ShoppingListErr(erCt.GET_SHOPPING_LISTS_ERROR);
      })
      .then(sl =>
          res.status(200).json({
            sl,
            categories,
          }));
  }))

  /**
   * @api {get} /user/getslcategories returns existing shopping lists categories
   *
   * @apiName  get Shop List Categories
   *
   * @apiGroup ShopList
   *
   * @apiSuccess {Object} categories feild with shop lists categories.
   *
   * @apiError ShoppingListErr GET_SL_CATEGORIES_ERROR.
   *
   */
  .get('/getslcategories', wrap(function* getCategories(req, res) {
    const categories = yield Categories.find({})
     .catch(() => {
       throw new error.ShoppingListErr(erCt.GET_SL_CATEGORIES_ERROR);
     });
    res.status(200).json({
      categories,
    });
  }))

  /**
   * @api {get} /user/shoplists/:title find shopping list by its title
   *
   * @apiName  find ShopList by its title
   *
   * @apiGroup ShopList
   *
   * @apiParam {String} title parameter with string for searching.
   * @apiSuccess {Object} sl param contains found shop list.
   *
   * @apiError ShoppingListErr FIND_SHOP_LIST_ERR.
   *
   */
  .get('/shoplists/:title', wrap(function* sltitle(req, res) {
    // log(req.params.title);
    // const filter = { purchaseTitle: new RegExp('^'+req.params.title+'$', "i")  };
    const filter = { purchaseTitle: { $regex: req.params.title, $options: 'ixm' } };
    yield user.findShopList(filter).then((sl) => (
      res.status(200).json({
        sl,
      })
    )).catch(() => {
      throw new error.ShoppingListErr(erCt.FIND_SHOP_LIST_ERR);
    });
  }))
  /**
   * @api {get} /shoppinglist/:id/ explicity get shopping list with its products
   * @apiName get The ShopList
   * @apiGroup ShopList
   *
   * @apiParam {String} id parameter inside url , defines shoppinglist ID.
   *
   * @apiSuccess {Object} info object with shop list info.
   * @apiSuccess {Object} products object with shop list products.
   * @apiSuccess {Object} theVendor object theVendor _id and email.
   * @apiSuccess {Object} cmt object with comments for shopping list.
   *
   * @apiError UserActionsErr, Errors while retriving shopping list .
   *
   */
  .get('/shoppinglist/:id', wrap(function* slid(req, res) {
    const sl = yield Purchase.findOne({ _id: req.params.id })
      .catch(() => {
        throw new error.UserActionsErr(erCt.PURCHASE_FIND_ERR);
      });
    const products = yield Product.find({ _id: { $in: sl.productsIDs } })
      .catch(() => {
        throw new error.UserActionsErr(erCt.GET_SL_PRODUCTS_ERR);
      });
    const theVendor = yield User.findOne({ _id: sl.vendor }, { _id: 1, email: 1 })
      .catch(() => {
        throw new error.UserActionsErr(erCt.GET_SL_SELLER_ERR);
      });
    const cmt = yield user.getSlComment(req.params.id);
    return res.status(200).json({
      info: sl,
      products,
      theVendor,
      cmt,
    });
  }))
  /**
   * @api {put} /shoppinglist/:id/comment Add comment to shoppinglist
   * @apiName AddSLComment
   * @apiGroup comments
   *
   * @apiParam {String} id parameter inside url,
   * defines ID of Shopping List which, will be commented.
   *
   * @apiSuccess {Object} cmt returns saved commentary document .
   * @apiSuccess {Object} message success message.
   *
   * @apiError UserActionsErr, Error while adding comment.
   *
   */
  .put('/shoppinglist/:id/comment', wrap(function* slidc(req, res) {
    const cmt = yield user.addComment(req.params.id, req.session.user._id, req.body.text);
    return res.status(200).json({
      message: rouTct.COMMEND_ADDED,
      cmt,
    });
  }))
  /**
   * @api {put} /shoppinglist/:id/comment/:oi Add comment to other comment
   * @apiName Comment a comment
   * @apiGroup comments
   *
   * @apiParam {String} id parameter inside url , defines shoppinglist ID.
   * @apiParam {String} oi parameter inside url , defines ID of parent comment .
   * @apiParam {String} text feild parameter with comment text .
   *
   * @apiSuccess {Object} cmt returns saved commentary document .
   * @apiSuccess {Object} message success message.
   *
   * @apiError UserActionsErr, Error while adding comment.
   *
   */
  .put('/shoppinglist/:id/comment/:oi', wrap(function* slidcoi(req, res) {
    const cmt = yield user.addComment(
      req.params.id,
      req.session.user._id,
      req.body.text,
      req.params.oi
    );
    return res.status(200).json({
      message: rouTct.COMMEND_ADDED,
      cmt,
    });
  }))
  /**
   * @api {get} /shoppinglist/:id/comment get comments for shop list
   * @apiName get SL comments
   * @apiGroup comments
   *
   * @apiParam {String} id parameter inside url , defines shoppinglist ID.
   *
   * @apiSuccess {Object} cmts returns documents with found comments .
   *
   * @apiError UserActionsErr, GET_COMMENT_ERR.
   *
   */
  .get('/shoppinglist/:id/comment', wrap(function* slidcget(req, res) {
    const cmts = yield user.getSlComment(req.params.id);
    return res.status(200).json({
      cmts,
    });
  }))
  /**
   * @api {get} /shoppinglist/:id/comment/:oi get comments of comment
   * @apiName get nestedComments
   * @apiGroup comments
   *
   * @apiParam {String} id parameter inside url , defines shoppinglist ID.
   * @apiParam {String} oi parameter inside url , defines ID of parent comment .
   *
   * @apiSuccess {Object} cmts returns documents with found comments .
   *
   * @apiError UserActionsErr, GET_COMMENT_ERR. .
   *
   */
  .get('/shoppinglist/:id/comment/:oi', wrap(function* slidcoiget(req, res) {
    const cmts = yield user.getSlComment(req.params.id, req.params.oi);
    return res.status(200).json({
      cmts,
    });
  }))
  /**
   * @api {post} /user/joinsl/ user Join Shopping List with selected products in parameters
   * @apiName Join Shopping list
   * @apiGroup ShopList
   *
   * @apiParam {Object} slInfo, shopping list info.
   * @apiParam {Object} products object with products id-key-feild = requested count.
   * @apiParam {String} stripeToken stripe token.
   *
   * @apiSuccess {String} message JOINED_SL_SUCCESS message.
   *
   * @apiError ShoppingListErr JOIN_SHOP_LIST_ERROR, JOIN_SL_ERR_PROCESSING.
   *
   */
  .post('/joinsl', wrap(validators.joinsl), wrap(function* joinslpost(req, res) {
    Object.assign(req.data, { buyer: req.session.user._id });
    // log('req.data.buyer   ', req.data.buyer);
    yield user.joinp(req.data).then(() =>
        res.status(200).json({
          message: rouTct.JOINED_SL_SUCCESS,
        })
    ).catch((err) => {
      throw new error.ShoppingListErr(erCt.JOIN_SHOP_LIST_ERROR + erCt.JOIN_SL_ERR_PROCESSING + err.message);
    });
  }))
  /**
   * @api {get} /user/getownp/ returns user's bought products
   *
   * @apiName  get Users purchases
   *
   * @apiGroup ShopList
   *
   * @apiParam {Number} page page number.
   * @apiParam {Number} limit elements per page limit.
   * @apiSuccess {Array} userownp array with user`s purchased products information.
   *
   * @apiError ShoppingListErr ERR_GETTING_PRODUCTS.
   *
   */
  .get('/getownp', wrap(function* getownp(req, res) {
    let page = 1;
    let limit = 15;
    if (typeof req.body.limit !== 'undefined') {
      limit = req.body.limit;
    }
    if (typeof req.body.page !== 'undefined') {
      page = req.body.page;
    }
    const userownp = yield user.getownp(req.session.user._id, page, limit).catch(() => {
      throw new error.ShoppingListErr(erCt.ERR_GETTING_PRODUCTS);
    });
    return res.status(200).json({
      userownp,
    });
  }))
  // .post('/reset_pass', wrap(validators.resetPass), wrap(function* slidc(req, res) {
  //   // const cmt = yield user.addComment(req.params.id, req.session.user._id, req.body.text);
  //   return res.status(200).json({
  //     message: rouTct.RESET_PASS_INFO_SENT,
  //   });
  // }))
  .get('/usernotes', user.usernotes)
  .post('/vendoreq', user.vendoreq)
  .post('/setnotestate/:id', user.setnotestate)
  .delete('/setnotestate/:id', user.deletenote);

route.use('/sadmin', checkIfSuperAdmin, sadminroute);
route.use('/admin', checkIfAdmin, adminroute);
route.use('/vendor', checkIfVendor, vendor);

export default route;
