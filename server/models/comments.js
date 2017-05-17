'use strict';
import mongoose from '../lib/connectMongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  shoppingList: {
    type: mongoose.Schema.Types.ObjectId, ref: 'purchase',
  },
  mainArticle: {
    type: mongoose.Schema.Types.ObjectId, ref: 'comments',
  },
  noteTitle: {
    type: String,
  },
  text: {
    type: String,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  date: {
    type: Date,
  },
});

export default mongoose.model('comments', schema);

