'use strict';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import debug from 'debug';
import path from 'path';
import expressValidator from 'express-validator';
// import webpack from 'webpack';
import methodOverride from 'method-override';
import { ENV, sessConf } from './appConfig';
import sessionStore from '../lib/session';
// import { grizzly } from '../lib/session';
// import error from '../errors';
// import { ENV } from './config/appConfig';
// import webpackDevConfig from '../../webpack/webpack.config.dev-client';

// const App = require('../../public/assets/server');

// eslint-disable-next-line
const log = debug('server:EXPRESS');
const loadUser = require('../middleware/loadUser').default;
// const routesConfig = require('../routes').default;

// if (ENV !== 'test') {
//   const App = require('../../public/assets/server');
// }

// import routesConfig from '../routes';

export default app => {
  app.set('port', (process.env.PORT || 3001));
  app.disable('x-powered-by');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride());
  app.use(expressValidator());
  if (ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../..', 'public')));
  }

  const sess = {
    resave: false,
    saveUninitialized: false,
    secret: sessConf.secret,
    name: 'sessionId',
    cookie: {
      httpOnly: true,
      secure: false,
    },
    store: sessionStore,
  };

  app.use(session(sess));

  app.use(loadUser);

  // routesConfig(app);

  // if (ENV !== 'test') {
  // app.get('*', App.default);
  // }
};
