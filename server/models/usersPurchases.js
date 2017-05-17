'use strict';
import mongoose from '../lib/connectMongoose';


const usersPurchases = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product',
  },
  productCount: {
    type: Number,
  },
  token: {
    type: String,
  },
});

export default mongoose.model('usersPurchases', usersPurchases);
