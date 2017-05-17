'use strict';
// import debug from 'debug';
import { NOT_A_VENDOR } from '../errors/consts';
import { ENUM_VENDOR } from '../models/consts';
import Error from '../errors';
// const log = debug('server:VENDOR_CHECK');
export default function CheckIfVendor(req, res, next) {
  // log('req.session.user.role   ' + req.session.user.role);
  if ((req.session.user.role.indexOf(ENUM_VENDOR) > -1)) {
    return next();
  }
  return next(new Error.RightsAccessError(NOT_A_VENDOR));
  // return;
}
