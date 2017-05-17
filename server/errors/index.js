import util from 'util';
import http from 'http';
// import debug from 'debug';
// log =debug('server:errors:index');


function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);

  this.status = status;
  this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(HttpError, Error);

HttpError.prototype.name = 'HttpError';

function RightsAccessError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, RightsAccessError);

  this.status = 403;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
  this.message = message;
}

util.inherits(RightsAccessError, HttpError);

RightsAccessError.prototype.name = 'RightsAccessError';


function AuthError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, AuthError);

  this.status = 400;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
  this.message = message;
}

util.inherits(AuthError, HttpError);

AuthError.prototype.name = 'AuthError';

function SuperAdminError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, SuperAdminError);

  this.status = 400;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
  this.message = message;
}

util.inherits(SuperAdminError, HttpError);

SuperAdminError.prototype.name = 'SuperAdminError';

function VendorError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, VendorError);

  this.status = 400;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
  this.message = message;
}

util.inherits(VendorError, HttpError);

VendorError.prototype.name = 'VendorError';

function ShoppingListErr(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ShoppingListErr);

  this.status = 400;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
  this.message = message;
}

util.inherits(ShoppingListErr, HttpError);

ShoppingListErr.prototype.name = 'ShoppingListErr';

function UserActionsErr(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, UserActionsErr);

  this.status = 400;
  this.message = message;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(UserActionsErr, HttpError);

UserActionsErr.prototype.name = 'UserActionsErr';

function StripeErr(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, StripeErr);

  this.status = 400;
  this.message = message;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(StripeErr, HttpError);

StripeErr.prototype.name = 'StripeErr';

function ResetPassErr(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, ResetPassErr);

  this.status = 400;
  this.message = message;
  // this.message = message || http.STATUS_CODES[status] || 'Error';
}

util.inherits(ResetPassErr, HttpError);

ResetPassErr.prototype.name = 'ResetPassErr';

function CustomServerError(message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, CustomServerError);

  this.status = 400;
  this.message = message;
}

util.inherits(CustomServerError, HttpError);

CustomServerError.prototype.name = 'CustomServerError';

export default {
  CustomServerError,
  ResetPassErr,
  UserActionsErr,
  ShoppingListErr,
  VendorError,
  SuperAdminError,
  AuthError,
  HttpError,
  RightsAccessError,
  StripeErr,
};
