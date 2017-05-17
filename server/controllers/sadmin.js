'use strict';
import Promise from 'bluebird';
import debug from 'debug';
import Categories from '../models/purchaseCategories';
import error from '../errors';
import * as ModelsCt from '../models/consts';
import * as ct from '../errors/consts';
import * as ctM from './consts';
import User from '../models/user';
// eslint-disable-next-line no-unused-vars
const log = debug('server:controller:SADMIN');
const cr = Promise.coroutine;
function respCat(res, message, addedAr, existMessage, existAr) {
  return res.status(200).json({
    message,
    added: addedAr,
    existmes: existMessage,
    existar: existAr,
  });
}
function sapusers(req, res, next) {
  cr(function* sapusersCr() {
    let page;
    if (typeof req.body.sapage === 'undefined') {
      page = 1;
    } else {
      page = req.body.sapage;
    }
    let filter;
    if (ModelsCt.userenums.indexOf(req.body.sapfilter) !== -1) {
      filter = { role: { $in: [req.body.sapfilter] } };
      Object.assign(req.session, { sapfilter: filter });
    } else if (ModelsCt.userenums.indexOf(req.session.sapfilter) !== -1) {
      filter = req.session.sapfilter;
    } else {
      // filter = req.session.sapfilter = { role: { $in: [ModelsCt.ENUM_USER] } };
      filter = { role: { $in: [ModelsCt.ENUM_USER] } };
      Object.assign(req.session, { sapfilter: filter });
    }
    let epp;
    if (typeof req.body.elemperpage === 'undefined' && req.body.elemperpage === null) {
      epp = 15;
    } else {
      epp = req.body.elemperpage;
    }
    let usrs = (yield User.find(filter, { email: 1, role: 1 }).skip(epp * (page - 1)).limit(epp));
    usrs = usrs.filter(obj => obj._id !== req.session.user._id);
    if (usrs == null) {
      return next(new error.SuperAdminError(ct.NO_USER_FOUND));
    }
    return res.status(200).json({
      users: usrs,
      page,
    });
  })().catch(() => next(new error.SuperAdminError(ct.DB_ERROR)));
}
function addrole(req, res, next) {
  if (
    typeof req.body.addroleto.email !== 'undefined'
  &&
    typeof req.body.addroleto.role !== 'undefined'
  ) {
    const addr = req.body.addroleto;
    cr(function* addroleCr() {
      if (ModelsCt.userenums.indexOf(addr.role) === -1) {
        throw (new error.SuperAdminError(ct.DB_ERROR));
      } else {
        const us = (yield User.findOne({ email: addr.email }, { role: 1 }));
        if (us == null) {
          return next(new error.SuperAdminError(ct.L_E_NO_SUCH_USER));
        }
        const hasRoleI = us.role.indexOf(addr.role);
        if (hasRoleI !== -1) {
          us.role.splice(hasRoleI, 1);
        } else {
          us.role.push(addr.role);
        }
        yield us.save();
        return res.status(200).json({
          message: ctM.ROLE_CHANGED,
          uscuroles: us.role,
        });
      }
    })().catch(err => next(err));
  } else {
    next(new error.SuperAdminError(ct.NO_PARAMS_RECIEVED));
  }
}
function addCategory(req, res, next) {
  if (req.body.categories.length > 0) {
    Categories.find({ categoryName: { $in: req.body.categories } }).then(cat => {
      if (cat.length === req.body.categories.length) {
        return respCat(res, ctM.CATEGORIES_EXIST_ALL);
      }
      const rC = req.body.categories;
      const existNames = [];
      // if (cat.length > 0) {
      // let e = 0;
      cat.forEach((cate) => {
        // ++e;
        existNames.push(rC.splice(rC.indexOf(cate.categoryName), 1));
      });
      return Promise.map(rC, catname => {
        const category = new Categories({ categoryName: catname });
        return category.save();
      })
        .then(() => respCat(res, ctM.CATEGORIES_ADDED, rC, ctM.CATEGORIES_EXIST_SOME, existNames))
        .catch(err => next(err));
      // }
    }).catch(er => next(er));
  }
  return next(new error.SuperAdminError(ct.NOCATSPECIFED));
}
export default {
  addCategory,
  sapusers,
  addrole,
};
