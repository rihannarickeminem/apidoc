import Joi from 'joi';
import error from '../errors';
import * as ct from '../errors/consts';
const schema = Joi.object().keys({
  password: Joi.string().min(8),
  email: Joi.string().email(),
}).with('username', 'birthyear').without('password', 'access_token');

export default function Validate(req, res, next) {
  if (typeof req.session.user !== 'undefined' && req.session.user !== null) {
    return next(new error.AuthError(ct.LS_ERROR_ALREADY_LOGINED));
  }
  Joi.validate({ email: req.body.email, password: req.body.password }, schema, (err) => {
    if (err === null) {
      next();
    }
    return next(new error.RightsAccessError(ct.EMAIL_OR_PASSWORD_NOT_VALID));
  });
}
