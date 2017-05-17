'use strict';
import crypto from 'crypto';
import mongoose from '../lib/connectMongoose';
import * as ct from './consts';

const Schema = mongoose.Schema;

const schema = new Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    lowercase: true,
  },
  role: {
    type: Array, default: [ct.ENUM_USER],
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  credicard: {
    type: Number,
  },
  salt: {
    type: String,
    required: true,
  },
  resetReqsDates: {
    type: Array,
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastResetPassReq: Date,
  resetPassReqsPerHour: {
    type: Number,
    default: 0,
  },
  isVendor: {
    status: {
      type: String,
    },
    reqid: {
      type: mongoose.Schema.Types.ObjectId, ref: 'vendorequest',
    },
  },
  joinPurch: [{
    purchId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'purchase',
    },
    products: [{
      productCode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
      count: {
        type: Number,
      },
    }],
    status: {
      type: String,
      enum: [ct.ENUM_SENT, ct.ENUM_DENIAL, ct.ENUM_JOINED],
    },
  }],
});
// schema.methods.encryptPassword = function (password) { // eslint-disable-line func-names
schema.methods.encryptPassword = function (password) { // eslint-disable-line func-names
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};
// schema.methods.encryptPassword = password =>
//   crypto.createHmac('sha1', this.salt).update(password).digest('hex');

schema.virtual('password')
  .set(function setvert(password) {
    this.plainPassword = password;
    this.salt = '${ Math.random() }  ';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(() => this.plainPassword);

schema.methods.checkPassword = function (password) { // eslint-disable-line func-names
  return this.encryptPassword(password) === this.hashedPassword;
};

export default mongoose.model('User', schema);
