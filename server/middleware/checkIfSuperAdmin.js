'use strict';
import error from '../errors';
// import debug from 'debug';
import { NOT_A_SUPERADMIN } from '../errors/consts';
import { ENUM_SUPER_ADMIN } from '../models/consts';

// const log = debug('server:checkifSUPERADMIN');

export default function checkIfSuperAdmin(req, res, next) {
  if (req.session.user.role.indexOf(ENUM_SUPER_ADMIN) > -1) {
    return next();
  }
  return next(new error.RightsAccessError(NOT_A_SUPERADMIN));
}
