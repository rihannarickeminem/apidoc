'use strict';
import mongoose from '../lib/connectMongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  forUserId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'user',
  },
  noteTitle: {
    type: String,
  },
  status: {
    type: String,
  },
  linktoNote: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

export default mongoose.model('usernotes', schema);

