'use strict';
import debug from 'debug';
import Promise from 'bluebird';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import mailgunApiTransport from 'nodemailer-mailgunapi-transport';
import error from '../errors';
import * as ModelsCt from '../models/consts';
import * as ct from '../errors/consts';
import * as ctM from './consts';

import User from '../models/user';
import Comments from '../models/comments';
import UsersPurchases from '../models/usersPurchases';
import UserNotes from '../models/userNotes';
import Purchase from '../models/purchases';
import Product from '../models/product';
import RemovedNotes from '../models/removedNotes';
import Vereq from '../models/becomeVendorReq';

// import { STRIPE_SECRET_KEY, MAILGUN_PASSWORD, MAILGUN_USER } from '../config/appConfig';

Promise.promisifyAll(crypto);

const cr = Promise.coroutine;
// eslint-disable-next-line no-unused-vars
const log = debug('server:USER CONTROLLER');
// const stripe = require('stripe')(STRIPE_SECRET_KEY[process.env.NODE_ENV]); // eslint-disable-line
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

function validateEmail(text) {
  // eslint-disable-next-line no-useless-escape, max-len
  const re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  return re.test(text);
}
function signup(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const passwordagain = req.body.passwordagain;
  if (password !== passwordagain) {
    return next(new error.AuthError(ct.PASSDIFFER));
  } else if (!validateEmail(email)) {
    return next(new error.AuthError(ct.MAILSYNTAX));
  }
  return User.findOne({ email }).then((us) => {
    if (us !== null) {
      return next(new error.AuthError(ct.USEREXISTS));
    }
    const user = new User({ email, password });
    return user.save((err) => {
      if (err) return next(err);
      Object.assign(req.session, { user });
      const resU = {
        email: user.email,
        _id: user._id,
        role: user.role,
      };
      return res.status(200).json({
        message: ctM.LOGINED,
        savedusr: resU,
      });
    });
  });
}

function mvpsignup(data) {
  const role = [ModelsCt.ENUM_USER];
  if (typeof data.role !== 'undefined') {
    role.push(data.role);
  }
  const user = new User({
    email: data.email,
    // credicard: data.credicard,
    password: data.password,
    role,
  });
  return user.save()
    .catch(() => {
      throw new error.AuthError(ct.AUTH_DB_ERROR);
    });
}

function getshoppinglists(filter, page, limit) {
  return Purchase.find(filter).skip(limit * (page - 1)).limit(limit);
}
function findShopList(filter) {
  return Purchase.findOne(filter);
}
// function joinsl(data) {
//   return data;
// }
function login(req, res, next) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user !== null) {
        if (user.checkPassword(req.body.password)) {
          // req.session.user = user;
          Object.assign(req.session, { user });
          const resU = {
            userEmail: user.email,
            userId: user._id,
            userRole: user.role,
          };
          res.status(200).json({
            message: ctM.LOGINED,
            savedusr: resU,
          });
        } else {
          next(new error.AuthError(ct.L_E_WRONG_PASS));
        }
      } else {
        next(new error.AuthError(ct.L_E_NO_SUCH_USER));
      }
    });
}

function logout(req, res) {
  // req.session.user = null;
  Object.assign(req.session, { user: null });
  res.redirect('/');
  // return res.status(200).json({
  //   message: ctM.LOGOUT_DONE,
  // });
}
function vendoreq(req, res, next) {
  cr(function* vendoreqCr() {
    if (typeof req.session.user.isVendor === 'undefined') {
      const usr = yield User.find({ email: req.session.user.email });
      const isVendor = {
        fullName: req.body.fullname,
        phoneNumber: req.body.phonenumber,
        userId: usr[0]._id,
        description: req.body.description,
      };
      let Vreq = new Vereq(isVendor);
      Vreq = yield Vreq.save();
      usr[0].isVendor.status = ModelsCt.VE_REQ_STATUS_REQUESTED;
      usr[0].isVendor.reqid = Vreq._id;
      usr[0].save();
      return res.status(200).json({
        message: ctM.VENDOREQ,
      });
    } else if (req.session.user.isVendor === ModelsCt.VE_REQ_STATUS_DENIED) {
      return next(new error.VendorError(ct.VENDOR_REQ_ALREADY_SENT));
    } else if (req.session.user.isVendor === ModelsCt.VE_REQ_STATUS_REQUESTED) {
      return next(new error.VendorError(ct.VENDOR_REQ_ALREADY_SENT));
    }
    return next(new error.VendorError(ct.VENDOR_REQ_ALREADY_VENDOR));
  })().catch((err) => {
    next(err);
  });
}
function usernotes(req, res, next) {
  cr(function* usernotesCr() {
    const notes = yield UserNotes.find({ forUserId: req.user._id });
    return res.status(200).json({
      notes,
    });
  })().catch((err) => {
    next(err);
  });
}

function setnotestate(req, res, next) {
  cr(function* setnotestateCr() {
    const query = { _id: req.params.id };
    const notes = yield UserNotes.find(query);

    notes[0].status = ModelsCt.READED;

    yield notes[0].save();

    return res.status(200).json({
      message: ctM.NOTE_READED,
    });
  })().catch((err) => {
    next(err);
  });
}


function deletenote(req, res, next) {
  cr(function* deletenoteCr() {
    const query = { _id: req.params.id };
    const note = yield UserNotes.findOneAndRemove(query);
    const remNote = new RemovedNotes(note);
    yield remNote.save();
    return res.status(200).json({
      message: ctM.NOTE_REMOVED,
    });
  })().catch((err) => {
    next(err);
  });
}
function joinp(data) {
  function makeCharge() {
    const charge = {
      amount: data.amount,
      currency: 'USD',
      card: data.stripeToken,
    };
    return stripe.charges.create(charge)
      .catch(ER => {
        throw new error.UserActionsErr(ER.message);
      });
  }
  return Promise.each(Object.keys(data.reqProducts), (id, i) => {
    Product.update(
      { _id: id, availableCount: { $gte: data.reqProducts[id] } },
      { $set: { availableCount: data.products[i].availableCount } }
    ).catch(() => {
      throw new error.UserActionsErr(ct.THERE_IS_NO_ANOUTH_PRODUCT);
    });
    const up = new UsersPurchases({
      userId: data.buyer,
      productId: id,
      productCount: data.reqProducts[id],
      token: data.stripeToken,
    });
    return up.save();
  })
    .then(() => {
      if (data.sl.condition === ModelsCt.SHOPPING_CONDITION_AMOUNT) {
        if (data.amount + data.sl.currentAmount > data.sl.conditionValue) {
          return Purchase.update(
            { _id: data.sl._id },
            { $set: { 'status.completed': true },
              $inc: { currentAmount: data.amount },
              $push: { participants: data.buyer },
            })
            .then(() => makeCharge());
        }
        return Purchase.update(
          { _id: data.sl._id },
          {
            $inc: { currentAmount: data.amount },
            $push: { participants: data.buyer },
          })
          .then(() => makeCharge());
      }
      let dspl = data.sl.participants.length;
      if (++dspl > data.sl.conditionValue) {
        return Purchase.update(
          { _id: data.sl._id },
          {
            $set: { 'status.completed': true },
            $push: { participants: data.buyer },
          })
          .then(() => makeCharge());
      }
      return Purchase.update({ _id: data.sl._id }, { $push: { participants: data.buyer } })
        .then(() => makeCharge());
    });
}
function getownp(userId, page, limit) {
  return UsersPurchases.find({ userId }).skip(limit * (page - 1)).limit(limit).then((res) => {
    const prdcts = res.map(x => x.productId);
    return Product.find({ _id: { $in: prdcts } });
  });
}
function getSlComment(slId, ancestor) {
  return Comments.find({ shoppingList: slId, mainArticle: ancestor })
    .catch(() => {
      throw new error.UserActionsErr(ct.GET_COMMENT_ERR);
    });
}
function addComment(slId, userId, text, ancestor) {
  const comment = new Comments({
    shoppingList: slId,
    authorId: userId,
    text,
    mainArticle: ancestor,
  });
  return comment.save().catch(() => {
    throw new error.UserActionsErr(ct.ADD_COMMENT_ERR);
  });
}
/* eslint-disable*/
function forgot(email, host) {
  let token;
  // let USER;
  // let resetPassReqsPerHour = 1;
  let theGap;
  const ONE_HOUR = 60 * 60 * 1000;
  const minF = ONE_HOUR/5;
  return crypto.randomBytesAsync(16).then(buf => {
    token = buf.toString('hex');
    // return token;
    return User.findOne({ email: email })
  }).then((user) => {
    if (!user) {
      throw new error.ResetPassErr(ct.PASS_TOKEN_TROUBLE);
    }
    if (user.resetReqsDates.length == 5) {
      theGap = Date.now() - user.resetReqsDates[0];
      if (theGap/5 < minF) {
        throw new error.ResetPassErr(ct.RESET_PASS_ERR_MANY_REQS);
      } else {
        user.resetReqsDates.shift();
        user.resetReqsDates.push(Date.now());
      }
    } else {
      user.resetReqsDates.push(Date.now());
    }
    // let  Date.now() - user.resetReqsDates[0];
    // USER = user;
    // if (typeof user.lastResetPassReq !== 'undefined') {
    //   if (Date.now() - user.lastResetPassReq < ONE_HOUR) {
    //     resetPassReqsPerHour = user.resetPassReqsPerHour + 1;
    //     if (resetPassReqsPerHour > 5) {
    //       throw new error.ResetPassErr(ct.RESET_PASS_ERR_MANY_REQS);
    //     }
    //     // Date.now() - user.lastResetPassReq < 5
    //   } else {

    //   }
    // } else {
    //   user.lastResetPassReq = Date.now();
    // }
    // resetPassReqsPerHour = user.resetPassReqsPerHour + 1;
    // if (resetPassReqsPerHour > 5) {
    //   throw new error.ResetPassErr(ct.RESET_PASS_ERR_MANY_REQS);
    // }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + (3600000*48);
    // user.resetPassReqsPerHour = resetPassReqsPerHour;
    return user.save();
  }).then(() => {
    const transporter = nodemailer.createTransport(
      mailgunApiTransport({
        // apiKey: MAILGUN_PASSWORD[process.env.NODE_ENV],
        apiKey: process.env.MAILGUN_PASSWORD,
        // domain: MAILGUN_USER[process.env.NODE_ENV],
        domain: process.env.MAILGUN_USER,
      }));
    const mailOptions = {
      to: email,
      from: 'Shopping Together site',
      subject: 'Reset your password on Shopping Together',
      text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      'http://' + host + '/reset/' + token + '\n\n' +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions,(err) => {
        if (err) reject();
        return resolve();
      });
    });
  });
  /* eslint-enable*/
}
function getToken(token) {
  return User
    .findOne({ resetPasswordToken: token })
    .where('resetPasswordExpires').gt(Date.now());
}
/* eslint-disable prefer-template */
function sendPassChanged(user) {
  const transporter = nodemailer.createTransport(
    mailgunApiTransport({
      // apiKey: MAILGUN_PASSWORD[process.env.NODE_ENV],
      apiKey: process.env.MAILGUN_PASSWORD,
      // domain: MAILGUN_USER[process.env.NODE_ENV],
      domain: process.env.MAILGUN_USER,
    }));
  const mailOptions = {
    to: user.email,
    from: 'Shopping Together Site',
    subject: 'Your shopping together password has been changed',
    text: 'Hello,\n\n' +
    'This is a confirmation that the password for your account ' +
    user.email + ' has just been changed.\n',
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) reject();
      return resolve(err);
    });
  });
}
function postToken(token, password) {
  let USER;
  return User
    .findOne({ resetPasswordToken: token })
    .where('resetPasswordExpires').gt(Date.now())
    .then(user => {
      if (!user) {
        throw new error.ResetPassErr(ct.PASS_TOKEN_TROUBLE);
      }
      Object.assign(user, {
        password,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        // lastResetPassReq: undefined,
        // resetPassReqsPerHour: undefined,
      });
      USER = user;
      return user.save();
    })
    .then(() => USER);
}
export default {
  forgot,
  findShopList,
  getSlComment,
  addComment,
  getownp,
  deletenote,
  setnotestate,
  vendoreq,
  joinp,
  login,
  logout,
  signup,
  usernotes,
  mvpsignup,
  getshoppinglists,
  getToken,
  postToken,
  sendPassChanged,
  // joinsl,
};
