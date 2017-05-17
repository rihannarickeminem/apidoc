'use strict';
// import debug from 'debug';
import User from '../models/user';
// const log = debug('server:loaduser');

export default function loadUser(req, res, next) {
  Object.assign(req, { user: null });
  Object.assign(res.locals, { user: null });
  if (!req.session.user) return next();
  return User.findById(req.session.user, (err, user) => {
    if (err) return next(err);
    Object.assign(req, { user });
    Object.assign(res.locals, { user });
    // log('req.user   ', req.user);
    return next();
  });
}
