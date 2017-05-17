'use strict';
import mongoose from '../lib/connectMongoose';

const purchase = new mongoose.Schema({
  purchaseTitle: {
    type: String,
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  description: {
    type: String,
  },
  purchaseCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category',
    required: true,
    index: true,
  },
  finishingDate: {
    type: Date,
    required: true,
  },
  condition: {
    type: String,
    required: true,
    default: 'MEMBERS',
  },
  conditionValue: {
    type: Number,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  productsIDs: [{
    type: mongoose.Schema.ObjectId,
    ref: 'product',
    required: true,
  }],
  status: {
    completed: {
      type: Boolean,
      index: true,
    },
    process: Boolean,
    failed: Boolean,
    closed: Boolean,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
});

export default mongoose.model('purchase', purchase);
