// ' use strict '
/* eslint-disable */
// import User from '../server//models/user';
// import categories from '../server/models/purchaseCategories';
// import debug from 'debug';
// import * as ct from '../server/errors/consts';
// import * as ctM from '../server/controllers/consts';
// import * as ModelsCt from '../server/models/consts';
// import * as tCt from './consts';
// import Promise from 'bluebird'; 
// import mongoose from '../server/lib/connectMongoose';
// import randomstring  from 'randomstring';

// const app = require("../server/index");
// const   supertest = require("supertest-session")(app);
// Promise.promisifyAll(supertest);

// const log = debug('server:test-users');
// const   superAdminMail = 'superadmin@checkmai.com';
// const   SAPASSWORD = 'superadminpassword';
// const   dbURI    = 'mongodb://localhost/st';
// const   util      = require('util');
// const   should   = require('chai').should();

// log('11');


// const   expect = require('chai').expect;
// describe('wrapper', function(){
//     let users = [];
//     let usersCount = 20;
//     let userRequestedForVendorRights = [];
//     before(function(done) {
//         done();
//     });
//     after(function(done){
//         done();

//     });
//                             // log('ERROR   '+err);
//     describe('allow purchases', function() {
//         const   supertest = require("supertest-session")(app);
//         it('success  SUPER ADMIN login /login 200', function (done) {
//             supertest
//             .post('/login')
//             .send({ email: superAdminMail, password: SAPASSWORD})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.LOGINED);
//                 done();
//             });
//         })
//         // it('allo purchase', function (done) {
//         //     supertest
//         //         .post('/signup')
//         //         .send({ email: email, password: password, passwordagain: password })
//         //         .end(function(err, res) {
//         //             expect(res.status).to.equal(200);
//         //             expect(res.body).to.have.property("message");
//         //             expect(res.body.message).to.equal(ctM.LOGINED);
//         //             done();
//         //         });
//         // })
//         // it('become vendor '+email+', request /vendoreq', function (done) {
//         //     supertest
//         //         .post('/user/vendoreq')
//         //         .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//         //         .end(function(err, res) {
//         //             expect(res.status).to.equal(200);
//         //             expect(res.body).to.have.property("message");
//         //             expect(res.body.message).to.equal(ctM.VENDOREQ);
//         //             done();
//         //         });
//         // })
//         // it('success logout /logout 200', function (done) {
//         //     supertest
//         //         .post('/logout')
//         //         .send({})
//         //         .end(function(err, res) {
//         //             expect(res.status).to.equal(200);
//         //             expect(res.body).to.have.property("message");
//         //             expect(res.body.message).to.equal(ctM.LOGOUT_DONE);
//         //             done();
//         //         });
//         // })
//     });
// });
//         // Promise.coroutine(function *() {
//         //     function intializeDatabase(count){
//         //         let users = [];
//         //         for(let z =0; z<count;z++){
//         //             let uzer = {};
//         //             uzer.email = randomstring.generate({ capitalization: 'lowercase' } )+'@gmail.com' 
//         //             uzer.password = randomstring.generate() 
//         //             users.push(uzer);
//         //         }
//         //         return users;
//         //     }
//         //     users = intializeDatabase(usersCount);
//         //     log('IIIIIIIIIIIIIIII!!!!!!!!!!!!!!!!!!!!!!!!!1           '+ userRequestedForVendorRights.length );
//         //     yield Promise.map(users, function(theRandmUsr, i)  {
//         //         let email = theRandmUsr.email;
//         //         let password = theRandmUsr.password;
//         //         // log(theRandmUsr);
//         //         return new Promise((resolve,reject)=>{
//         //             describe('vendor reqs '+email, function(i){
//         //                 it(email+'  signup', function (done) {
//         //                     supertest
//         //                         .post('/signup')
//         //                         .send({ email: email, password: password, passwordagain: password })
//         //                         .end(function(err, res) {
//         //                             userRequestedForVendorRights.push(res.body.savedusr);
//         //                             expect(res.status).to.equal(200);
//         //                             expect(res.body).to.have.property("message");
//         //                             expect(res.body.message).to.equal(ctM.LOGINED);
//         //                             done();
//         //                         });
//         //                 })
//         //                 it('become vendor '+email+', request /vendoreq', function (done) {
//         //                     supertest
//         //                         .post('/user/vendoreq')
//         //                         .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//         //                         .end(function(err, res) {
//         //                             expect(res.status).to.equal(200);
//         //                             expect(res.body).to.have.property("message");
//         //                             expect(res.body.message).to.equal(ctM.VENDOREQ);
//         //                             done();
//         //                         });
//         //                 })
//         //                 it('success logout /logout 200', function (done) {
//         //                     supertest
//         //                         .post('/logout')
//         //                         .send({})
//         //                         .end(function(err, res) {
//         //                             expect(res.status).to.equal(200);
//         //                             expect(res.body).to.have.property("message");
//         //                             expect(res.body.message).to.equal(ctM.LOGOUT_DONE);
//         //                             done();
//         //                             resolve('!!!');
//         //                         });
//         //                 })
//         //             })
//         //         })
//         //         log(theRandmUsr);
//         //     }).then((f)=>{
//         //         log( f instanceof Array);
//         //         log('completed!!'+f);
//         //     });
//         //     log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%           ' );
//         //     log('IIIIIIIIIIIIIIII!!!!!!!!!!!!!!!!!!!!!!!!!1           '+ userRequestedForVendorRights.length );
//         // })().catch(function(err) {
//         //     log(err);
//         // });

// //     });
// // });

