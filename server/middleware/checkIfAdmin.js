'use strict';
// import debug from 'debug';
import error from '../errors';
import { ENUM_ADMIN, ENUM_SUPER_ADMIN } from '../models/consts';
import { NOT_AN_ADMIN } from '../errors/consts';

// const log = debug('server:checkifADMIN');
export default function CheckIfAdmin(req, res, next) {
  // log('req.session.user.role   ' + req.session.user.role);
  if (
    (req.session.user.role.indexOf(ENUM_ADMIN) > -1) ||
    (req.session.user.role.indexOf(ENUM_SUPER_ADMIN) > -1)
  ) {
    return next();
  }
  return next(new error.RightsAccessError(NOT_AN_ADMIN));
}
