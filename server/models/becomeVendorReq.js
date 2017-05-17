'use strict';
import mongoose from '../lib/connectMongoose';
import * as ct from './consts';

const becomvendor = new mongoose.Schema({
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
  },
  status: {
    type: String,
    default: ct.VE_REQ_STATUS_REQUESTED,
  },
  deniedescr: {
    text: {
      type: String,
    },
  },
  description: {
    type: String,
  },
});

export default mongoose.model('vendorequest', becomvendor);
