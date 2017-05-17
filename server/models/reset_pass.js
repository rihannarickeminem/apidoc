'use strict';
import mongoose from '../lib/connectMongoose';

const resetPass = new mongoose.Schema({
  email: { type: String },
  hashed_pass: String,
  link_availability_date: Date,
  req_count: Number,
  req_count_date: Date,
});

export default mongoose.model('resetPass', resetPass);
