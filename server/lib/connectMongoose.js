'use strict';
import mongoose from 'mongoose';
import debug from 'debug';
import Promise from 'bluebird';
// import { dbUrl } from '../config/mongoConfig';
import { dbUrl } from '../config/appConfig';
mongoose.Promise = Promise;

const log = debug('server:lib:connectMongoose');

export default mongoose.connect(dbUrl, err => {
  if (err) {
    log(`error connectint to ${dbUrl}, reason: ${err}`);
  } else {
    log(`»»»»» successfully connected to  ${dbUrl}`);
  }
});
