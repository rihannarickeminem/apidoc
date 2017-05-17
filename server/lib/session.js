'use strict';
import ExSession from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from './connectMongoose';

const MongoStore = connectMongo(ExSession);

const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });
export default sessionStore;
