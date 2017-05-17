'use strict';
import mongoose from '../lib/connectMongoose';


const product = new mongoose.Schema({
  shopListId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'purchase',
  },
  productName: {
    type: String,
    default: '',
  },
  description: {
    type: String,
  },
  productCode: {
    type: String,
    unique: true,
  },
  integer: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
  },
  availableCount: {
    type: Number,
  },
  pictures: [{
    type: String,
  }],
});

export default mongoose.model('product', product);
