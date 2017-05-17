'use strict';
function defaultExport() {}

defaultExport.ENV = process.env.NODE_ENV || 'development';

defaultExport.dbUrl = process.env.MONGODB_DB_URL || 'mongodb://localhost/st';
defaultExport.sessConf = Object.assign({
  secret: 'VerySecret',
  key: 'jey',
  name: 'thesession',
  cookie: {
    path: '/',
    httpOnly: true,
  },
});

module.exports = defaultExport;
