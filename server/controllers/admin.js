'use strict';
import Promise from 'bluebird';
import debug from 'debug';
import vereqs from '../models/becomeVendorReq';
import User from '../models/user';
import Notes from '../models/userNotes';
import * as ModelsCt from '../models/consts';
import * as ctM from './consts';
import purchases from '../models/purchases';
const cr = Promise.coroutine;
// eslint-disable-next-line no-unused-vars
const log = debug('server:controller:ADMIN');
function requests(req, res, next) {
  cr(function* requestsCr() {
    let page;
    if (typeof req.body.sapage === 'undefined') {
      page = 1;
    } else {
      page = req.body.sapage;
    }
    const vendorreqs = yield vereqs.find(
      { status: ModelsCt.VE_REQ_STATUS_REQUESTED }
    ).skip(15 * (page - 1)).limit(15);

    const createpureq = yield purchases.find(
      { 'status.requested': true }
    ).skip(15 * (page - 1)).limit(15);

    res.status(200).json({
      vendorreqs,
      createpureq,
    });
  })().catch(err => next(err));
}
function allovendor(req, res, next) {
  cr(function* allovendorCr() {
    if (req.body.switchto === ModelsCt.VE_REQ_STATUS_ALLOWED) {
      const vendorReq = yield vereqs.find({ _id: req.body.vendreq._id });
      vendorReq[0].status = ModelsCt.VE_REQ_STATUS_ALLOWED;
      yield vendorReq[0].save();
      const user = yield User.find({ _id: req.body.vendreq.userId });
      user[0].isVendor.status = ModelsCt.VE_REQ_STATUS_ALLOWED;
      user[0].role.push(ModelsCt.ENUM_VENDOR);
      yield user[0].save();
      const note = new Notes({
        forUserId: user[0]._id,
        status: ModelsCt.NOTREADED,
        noteTitle: ModelsCt.NOTE_T_VREQ_ALLOWED,
        linktoNote: req.body.vendreq._id,
      });
      yield note.save();
      res.status(200).json({
        message: ctM.VENDOR_RIGHTS_ALLOWED,
      });
    } else if (req.body.switchto === ModelsCt.VE_REQ_STATUS_DENIED) {
      const vendorReq = yield vereqs.find({ _id: req.body.vendreq._id });
      vendorReq[0].status = ModelsCt.VE_REQ_STATUS_DENIED;
      vendorReq[0].deniedescr.text = req.body.deniedescr;
      yield vendorReq[0].save();
      const user = yield User.find({ _id: req.body.vendreq.userId });
      user[0].isVendor.status = ModelsCt.VE_REQ_STATUS_DENIED;
      yield user[0].save();
      const note = new Notes({
        forUserId: user[0]._id,
        status: ModelsCt.NOTREADED,
        noteTitle: ModelsCt.NOTE_T_VREQ_DENI,
        linktoNote: req.body.vendreq._id,
      });
      yield note.save();
      res.status(200).json({
        message: ctM.VENDOR_RIGHTS_DENIED,
      });
    }
  })().catch(err => next(err));
}
function denievendor() {
}
function allovpurch() {
}
function deniepurch() {
}
export default {
  allovendor,
  denievendor,
  allovpurch,
  deniepurch,
  requests,
};
