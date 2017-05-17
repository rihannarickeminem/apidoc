'use strict';
/* global define, it, describe, before, after */
/* eslint-disable */
import uuid from 'node-uuid';
import Promise from 'bluebird';
import os from 'os';
import io from 'socket.io-client';
import debug from 'debug';
import path from 'path';
import fs from 'fs';
import request from 'supertest-as-promised';
import randomstring from 'randomstring';
import lorem from 'lorem-ipsum';
import Categories from '../server/models/purchaseCategories';
import * as ModelsCt from '../server/models/consts';
import * as tCt from './consts';
import mongoose from '../server/lib/connectMongoose';

const log = debug('server:test-MVP');
const app = require('../server/index');
const supertest = require('supertest-session')(app);
// const end_point = 'http://' + os.hostname() + ':3000';
const end_point = 'http://localhost:3000';
const opts = {forceNew: true};
const socketURL = 'http://localhost:3000';

// var options ={
//   'path': '/user/shoppinglist/',
//   // transports: ['websocket'],
//   'force new connection': true
// };

Promise.promisifyAll(supertest);
Promise.promisifyAll(fs);

const dbURI = tCt.DBURI;
const util = require('util'); // eslint-disable-line no-unused-vars
/* eslint-enable */

const expect = require('chai').expect;
const categoryID = [];
describe('MVP tests', () => {
  before(done => {
    Promise.coroutine(function* rmCollections() {
      const collections = [
        'purchases',
        'comments',
        'userspurchases',
        'categories',
        'products',
        'users',
        'sessions',
        'vendorequests',
        'usernotes',
      ];
      yield Promise.map(collections, collection => {
        mongoose.connection.db.dropCollection(collection);
      });
      yield Promise.map(tCt.CATEGORY_NAMES, categoryname => {
        const category = new Categories({ categoryName: categoryname });
        categoryID.push(category);
        category.save();
      });
      done();
    })().catch(err => {
      log(err);
      done();
    });
  });
  describe('user APIs,', () => {
    const agentVendor = request.agent(app);
    it('signup vendor', () => {
      const user = {};
      user.email = `${randomstring.generate({ capitalization: 'lowercase' })}@gmail.com`;
      user.password = randomstring.generate();
      return agentVendor
        .post('/mvpsignup')
        .send({
          email: user.email,
          role: ModelsCt.ENUM_VENDOR,
          password: `${user.password}asdf`,
          passwordagain: user.password,
        })
        .expect(400)
        .then(() =>
            agentVendor
          .post('/mvpsignup')
          .send({
            email: user.email,
            role: ModelsCt.ENUM_VENDOR,
            password: user.password,
            passwordagain: user.password,
          })
          .expect(200)
        );
    });
    it('upload image fail, Vendor', () => {
      const Path = path.join(__dirname, 'consts.js');
      return agentVendor
        .post('/user/vendor/upload_image')
        .attach('file', Path)
        .expect(400)
        .then(res => {
          // eslint-disable-next-line no-underscore-dangle
          const cookie = res.req._headers.cookie.replace(/=/g, '%3D');
          log('cookie  ', cookie);
          expect(res.body).to.have.property('err');
        });
    });
    const picTempPath = [];
    it('upload images, Vendor', () => {
      const picPath = path.join(__dirname, 'turtles');
      return fs.readdirAsync(picPath).each(filename =>
          agentVendor
        .post('/user/vendor/upload_image')
        .attach('file', `${picPath}/${filename}`)
        .expect(200).then(rs => picTempPath.push(rs.body.newPath))
      );
    });
    let shopListToEdit;
    it('create Shopping List,  Vendor', () => {
      const shoplist = {
        purchaseTitle: 'shopping LIST',
        description: 'THE SHOPPING LIST WITH URLS !!!!',
        purchaseCategory: categoryID[5]._id,
        finishingDate: Date.now() + 5000000,
        condition: ModelsCt.SHOPPING_CONDITION_AMOUNT,
        conditionValue: 5000,
      };
      const products = [
        {
          productName: 'Turtles',
          productCode: 'D5g3S',
          description: 'the best turtles',
          integer: true,
          price: 1000,
          availableCount: 10,
          pictures: picTempPath.slice(10, 14),
        },
        {
          productName: ' blue Turtles',
          productCode: ' D2g3S',
          description: ' the best turtles',
          integer: true,
          price: 1000,
          availableCount: 10,
          pictures: picTempPath.slice(0, 5),
        },
        {
          productName: 'the blue Turtles',
          productCode: 'D2g3j',
          description: 'the best turtles',
          integer: true,
          price: 1000,
          availableCount: 10,
          pictures: picTempPath.slice(5, 10),
        },
      ];
      return agentVendor
        .post('/user/vendor/createp')
        .send({ products, shoplist })
        .expect(200)
        .then(() =>
            agentVendor
          .get('/user/vendor/ownlists')
          .expect(200)
        )
        .then(res => {
          shopListToEdit = res.body.ownlists[0]._id;
        });
    });
    it('edit Shopping List, success, Vendor', () => {
      const newPurchaseTitle = 'The New Title of That Great Shopping List';
      const newDescription = 'The New DESCRIPTION of That Great Shopping List';
      const shoplist = {};
      shoplist.purchaseTitle = newPurchaseTitle;
      shoplist.description = newDescription;
      return agentVendor
        .put(`/user/vendor/slist/${shopListToEdit}`)
        .send({ shoplist })
        .expect(200)
        .then(() => agentVendor
          .get('/user/vendor/ownlists')
          .expect(200)
        )
        .then(res => {
          expect(res.body).to.have.property('ownlists');
          expect(res.body.ownlists).to.be.instanceof(Array);
          expect(res.body.ownlists[0]).to.have.property('purchaseTitle');
          expect(res.body.ownlists[0].purchaseTitle).to.equal(newPurchaseTitle);
          expect(res.body.ownlists[0]).to.have.property('description');
          expect(res.body.ownlists[0].description).to.equal(newDescription);
        });
    });
    const agent = request.agent(app);
    it('signup user, join shopping list', () => {
      const user = {};
      let slProducts = {};
      let slInfo = {};
      user.email = `${randomstring.generate({ capitalization: 'lowercase' })}@gmail.com`;
      user.password = randomstring.generate();
      return agent
        .post('/mvpsignup')
        .send({
          email: user.email,
          password: `${user.password}asdf`,
          passwordagain: `dsfdsf${user.password}`,
        })
        .expect(400)
        .then(() =>
            agent
          .post('/mvpsignup')
          .send({
            email: user.email,
            password: user.password,
            passwordagain: user.password,
          })
          .expect(200)
        )
        .then(() =>
            agent
          .get('/user/shoplists')
          .expect(200)
        )
        .then(res => {
          expect(res.body).to.have.property('categories');
          expect(res.body.categories).to.be.instanceof(Array);
          expect(res.body).to.have.property('sl');
          expect(res.body.sl).to.be.instanceof(Array);
          return agent
            .get(`/user/shoppinglist/${res.body.sl[0]._id}`)
            .expect(200);
        })
        .then((res) => {
          const products = {};
          slProducts = res.body.products;
          slInfo = res.body.info;
          products[slProducts[0]._id] = 4;
          products[slProducts[1]._id] = 11;
          return agent
            .post('/user/joinsl')
            .send({ })
            .expect(400);
        })
        .then(() => {
          const products = {};
          const stripeToken = 'aw34yb43b4ya34';
          products[slProducts[0]._id] = 4;
          products[slProducts[1]._id] = 7;
          return agent
            .post('/user/joinsl')
            .send({ products, slInfo, stripeToken })
            .expect(400);
        })
        .then(() => {
          agent
            .get('/user/getownp')
            .expect(200);
        })
        .then(() =>
            agent
          .put(`/user/shoppinglist/${slInfo._id}/comment/`)
          .send({ text: `${lorem()}the  kkk  commentaries !!!` })
          .expect(200)
        )
        .then(res =>
            agent
          .put(`/user/shoppinglist/${slInfo._id}/comment/${res.body.cmt._id}`)
          .send({ text: `${lorem()}commentaries for COMMENTARIES !!!!!c11` })
          .expect(200)
        )
        .then(() =>
            agent
          .get(`/user/shoppinglist/${slInfo._id}/comment/`)
          .expect(200)
        )
        .then(res =>
            agent
          .get(`/user/shoppinglist/${slInfo._id}/comment/${res.body.cmts[0]._id}`)
          .expect(200)
        )
        .then(() =>
            agent
          .get('/user/shoplists/   shOPP ')
          .expect(200)
        )
        .then(() =>
            agent
          .get('/user/getslcategories/')
          .expect(200)
        );
    });
    it('Vendor delete/edit products', () => {
      let prdcts;
      const product = {};
      product.productName = 'UNIQUE TURTLES';
      product.description = 'Most awasome TURTLES!!!!';
      return agentVendor
        .get(`/user/shoppinglist/${shopListToEdit}`)
        .expect(200)
        .then(res => {
          // log('shop list ', res.body);
          prdcts = res.body.products;
          return agentVendor
            .delete(`/user/vendor/slist/${shopListToEdit}/${res.body.products[0]._id}`)
            .expect(200);
        })
        .then(() =>
            agentVendor
          .put(`/user/vendor/slist/${shopListToEdit}/${prdcts[1]._id}`)
          .send({ product })
          .expect(200)
        )
        .then(() =>
            agentVendor
          .get(`/user/shoppinglist/${shopListToEdit}`)
          .expect(200)
        )
        .then(res => {
          expect(res.body).to.have.property('products');
          expect(res.body.products).to.be.instanceof(Array);
          expect(res.body.products[0]).to.have.property('productName');
          expect(res.body.products[0].productName).to.equal(product.productName);
          expect(res.body.products[0]).to.have.property('description');
          expect(res.body.products[0].description).to.equal(product.description);
        });
    });
    // const chatUser1 = { thename: 'Tom' };
    // it('Should broadcast comment', done => {
    //   const options = {
    //  // path: '/user/shoppinglist/',
    //  'force new connection': true,
    //   };
    //   const theSocketURL = 'http://localhost:3000';
    //   const client = io(theSocketURL, options);
// // client.on('connect',function() {
// //      client.emit('join', 'test room');
// // });
// var room = "abc123";

// socket.on('connect', function() {
   // // Connected, let's sign-up for to receive messages for this room
   // socket.emit('join', room);
// });

// client.on('broadcast event', function (msg) {
// log('ffff');
  // log('>>>', msg);
    //    done();
// })

// // log('client ', Object.keys(client));
    //   // eslint-disable-next-line
    //   // client.on('connect', data => {
    //   // socket.emit('leave channel', activeChannel);
    //   // const newMessage = {
    //   //   id: `${Date.now()}${uuid.v4()}`,
    //   //   channelID: `${shopListToEdit}`,
    //   //   text: 'testtttstst',
    //   //   user: 'common user',
    //   // };
    //   const newChannel = {
    //  name: 'The Channel Name',
    //  id: `${shopListToEdit}`,
    //  private: false
    //   };
    //   // client.join('test room');
    //   // client.emit('join channel', newChannel);
    //   // // client.emit('connection name', chatUser1);
    //   // client.on('test message', msg => {
    //   //   log('msg !!!!!');
    //   //   log('msg ', msg);
    //   //  done();
    //   // });
    //   // client.emit('new message', 'ololo');

    //   // done();
    //   // });
    // });
  });
});
