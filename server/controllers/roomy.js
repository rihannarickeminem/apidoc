'use strict';
import debug from 'debug';
import Promise from 'bluebird';
import error from '../errors';
import Category from '../models/purchaseCategories';
import * as ct from '../errors/consts';

const cr = Promise.coroutine;
const log = debug('server:controller:ROOMY');

function pcategories(req, res, next) {
  cr(function* pcategoriesCr() {
    let page;
    if (typeof req.body.sapage === 'undefined') {
      page = 1;
    } else {
      page = req.body.sapage;
    }
    let filter;
    filter = {}; // eslint-disable-line prefer-const
    const categories = (yield Category.find(filter).skip(15 * (page - 1)).limit(15));
    log(categories);
    if (categories === 0) {
      return next(new error.HttpError(400, ct.NO_CATEGORIES_FOUND));
    }
    return res.status(200).json({
      categories,
      page,
    });
  })().catch((err) => {
    log('sapusers:  ${err}', err);
    return next(new error.SuperAdminError(ct.DB_ERROR));
  });
  return;
}


export default {
  pcategories,
};
