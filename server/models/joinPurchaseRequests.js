'use strict';
import mongoose from '../lib/connectMongoose';

const joinPurchaseRequest = new mongoose.Schema({
  email: { type: String },
  isAllowed: {
    allowed: Boolean,
    requested: Boolean,
    denied: {
      descr: String,
    },
  },
  description: Date,
  productsCount: Number,
});

export default mongoose.model('joinPurchaseRequest', joinPurchaseRequest);
