'use strict';
import mongoose from '../lib/connectMongoose';

const Category = new mongoose.Schema({
  categoryName: {
    type: String,
    unique: true,
  },
});
export default mongoose.model('Category', Category);

