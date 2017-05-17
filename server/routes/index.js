'use strict';
import Promise from 'bluebird';

import debug from 'debug';
import User from '../models/user';
import error from '../errors';
import { user as uAuth } from '../controllers';
import useroute from './user.js';
import roomy from './roomy.js';
import validators from '../middleware/validators';
import * as ct from '../errors/consts';
import * as ctM from '../controllers/consts';
import Categories from '../models/purchaseCategories';

const checkAuth = require('../middleware/checkAuth').default;
const validate = require('../middleware/validate').default;
// const setRedirect = require('middleware-responder').setRedirect;

// eslint-disable-next-line no-unused-vars
const log = debug('server:INDEX ROUTER');

function wrap(genFn) {
  const cr = Promise.coroutine(genFn);
  return (req, res, next) => cr(req, res, next).catch(next);
}

export default app => {
  /**
   * @api {post} /mvpsignup/ signup as vendor/buyer
   * @apiName sign up
   * @apiGroup SiteAccess
   *
   * @apiParam {String} email user email.
   * @apiParam {String} password the password must be 8 chars length.
   * @apiParam {String} passwordagain the password again, must be the same as other password.
   * @apiParam {String} role optional parameter equals 'IS_VENDOR',
   * if specified- it registers the user with vendor rights.
   *
   * @apiSuccess {String} message /server/controllers/consts LOGINED.
   * @apiSuccess {Object} savedusr Saved user info.
   * @apiSuccess {String} savedusr.userEmail Saved user email.
   * @apiSuccess {String} savedusr.userId Saved user document's id.
   * @apiSuccess {String} savedusr.userRole Saved user role-rights.
   *
   * @apiError AuthError, errors consts USEREXISTS, AUTH_DB_ERROR .
   *
   */
  app.post('/mvpsignup', validators.ssign, wrap(function* mvpsignpost(req, res) {
    const data = req.body;
    const usr = yield User.findOne({ email: data.email });
    if (usr !== null) {
      throw (new error.AuthError(ct.USEREXISTS));
    }
    yield uAuth.mvpsignup(data)
    .then((user) => {
      Object.assign(req.session, { user });
      const resU = {
        userEmail: user.email,
        userId: user._id,
        userRole: user.role,
      };
      return res.status(200).json({
        message: ctM.LOGINED,
        savedusr: resU,
      });
    });
  }));
  /**
   * @api {post} /login/ login inside, and enteract with application
   * @apiName Login
   * @apiGroup SiteAccess
   *
   * @apiParam {String} email user email.
   * @apiParam {String} password the password must be 8 chars length.
   *
   * @apiSuccess {String} message /server/controllers/consts LOGINED.
   *
   * @apiError AuthError, /errors/consts.js L_E_WRONG_PASS, L_E_NO_SUCH_USER .
   *
   */
  app.post('/login', uAuth.login);
  app.post('/signup', validate, uAuth.signup);
  /**
   * @api {post} /logout/ the Logout from application
   * @apiName Logout
   * @apiGroup SiteAccess
   *
   * @apiSuccess {200} 200 redirects to / landing page.
   *
   * @apiError AuthError, /errors/consts.js L_E_WRONG_PASS, L_E_NO_SUCH_USER .
   *
   */
  app.post('/logout', uAuth.logout);
  /**
   * @api {post} /forgot/ reset password
   * @apiName forgot Password
   * @apiGroup SiteAccess
   *
   * @apiParam {String} email user email, on which password will be sent.
   *
   * @apiSuccess {String} message /server/controllers/consts LOGINED.
   *
   * @apiError ResetPassErr, /errors/consts.js RESET_PASS_EMAIL_REQUIRED .
   *
   */
  app.post('/forgot', validators.reset_pass,
  wrap(function* forgotpass(req, res) {
    yield uAuth.forgot(req.reset_mail, req.headers.host)
    .catch((err) => {
      throw new error.ResetPassErr(ct.RESET_PASS_CONTROLLER_ERROR + err.message);
    });
    return res.status(200).json({
      message: ctM.PASSWORD_RESETTED,
    });
  }));
  /**
   * @api {get} /reset/:token get user password reset token
   * @apiName get user with reset mail token
   * @apiGroup SiteAccess
   *
   * @apiParam {String} token for password resetting, previously sent on user email.
   *
   * @apiSuccess {String} token req.params.token.
   *
   * @apiError ResetPassErr, /errors/consts.js PASS_TOKEN_TROUBLE .
   *
   */
  app.get('/reset/:token', wrap(function* forgotpass(req, res) {
    if (req.user) {
      return res.redirect('/');
    }
    yield uAuth.getToken(req.params.token)
  .then(usr => {
    if (!usr) {
      throw new error.ResetPassErr(ct.PASS_TOKEN_TROUBLE);
    }
  }).cath(() => {
    throw new error.ResetPassErr(ct.PASS_TOKEN_TROUBLE);
  });
    return res.status(200).json({
      token: req.params.token,
    });
  }));
  /**
   * @api {post} /reset/:token enter new password and confirm it, email user with success message
   * @apiName PostResetToken
   * @apiGroup SiteAccess
   *
   * @apiParam {String} password new user password.
   * @apiParam {String} confirm confirm password.
   *
   * @apiSuccess {String} token req.params.token.
   *
   * @apiError ResetPassErr, /errors/consts.js PASS_TOKEN_TROUBLE .
   *
   */
  app.post('/reset/:token', wrap(function* forgotpass(req, res) {
    req.assert('password', 'Password must be at least 8 characters long.').len(8);
    req.assert('confirm', 'Passwords must match.').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      throw new error.ResetPassErr(errors);
    }

    const usr = yield uAuth.postToken(req.params.token, req.body.password)
    .then((user) => {
      Object.assign(req.session, { user });
      return user;
    })
  .catch(() => {
    throw (new error.ResetPassErr(ct.CHANGE_PASS_ERR));
  });
    yield uAuth.sendPassChanged(usr)
    .catch(() => {
      throw new error.ResetPassErr(ct.RESET_PASS_CONTROLLER_ERROR);
    });
    return res.status(200)
    .json({
      token: ctM.PASSWORD_CHANGED,
    });
  }));
  app.get('/getslcategories', wrap(function* getCategories(req, res) {
    const categories = yield Categories.find({})
    .catch(() => {
      throw new error.ShoppingListErr(ct.GET_SL_CATEGORIES_ERROR);
    });
    res.status(200).json({
      categories,
    });
  }));
  app.use('/user', checkAuth, useroute);
  app.use('/roomy', roomy);
  app.use((err, req, res, next) => {  // eslint-disable-line no-unused-vars
    if (err instanceof error.HttpError) {
      res.status(err.status).json({
        err: err.message,
      });
    } else {
      Object.assign(err, new error.HttpError(500));
      res.status(err.status).json({
        err: err.message,
      });
    }
  });
};
