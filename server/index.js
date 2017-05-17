'use strict';

import 'dotenv/config';
import express from 'express';
import debug from 'debug';
import webpack from 'webpack';
// import SocketIo from 'socket.io';

import expressConfig from './config/express';
// import socketEvents from './socketEvents';
import { ENV } from './config/appConfig';
import webpackDevConfig from '../webpack/webpack.config.dev-client';
const log = debug('server:socketIO');

let App;
if (ENV !== 'test') {
  // const App = require('../public/assets/server');
  App = require('../public/assets/server');
  // eslint-disable-next-line
}
const app = express();
const routesConfig = require('./routes').default;
// eslint-disable-next-line

  /* eslint-disable global-require, import/no-unresolved */
  // if (ENV !== 'test') {
if (ENV === 'development') {
  const compiler = webpack(webpackDevConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler));
}
  // }
  /* eslint-enable global-require */
expressConfig(app);

routesConfig(app);

if (ENV !== 'test') {
// eslint-disable-next-line
  app.get('*', App.default);
}

// eslint-disable-next-line
const server = app.listen(app.get('port'));
log(`»»» NODE  Environment: ${ENV}`);
log(`Express listening on port: ${app.get('port')}`);


// const io = new SocketIo(server, { path: '/user/shoppinglist/' });
// const io = new SocketIo(server);

// socketEvents(io);

module.exports = app;
