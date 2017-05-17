'use strict';
import debug from 'debug';
import { NOT_AUTHORISED } from '../errors/consts';
import error from '../errors';
// eslint-disable-next-line no-unused-vars
const log = debug('server:INDEX ROUTER');

export default function checkAuth(req, res, next) {
  if (!req.session.user) {
    return next(new error.AuthError(NOT_AUTHORISED));
  }
  return next();
}
