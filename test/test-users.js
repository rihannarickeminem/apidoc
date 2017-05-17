// ' use strict '
/* eslint-disable */
// import User from '../server//models/user';
// import categories from '../server/models/purchaseCategories';
// import debug from 'debug';
// import * as ct from '../server/errors/consts';
// import request from 'supertest-as-promised';
// import * as ctM from '../server/controllers/consts';
// import * as ModelsCt from '../server/models/consts';
// import * as tCt from './consts';
// import Promise from 'bluebird'; 
// import mongoose from '../server/lib/connectMongoose';
// import randomstring  from 'randomstring';

// // import agent from 'supertest-as-promised';

// // const agent = require('supertest-as-promised').default;
// const log = debug('server:test-users');
// const app = require("../server/index");
// const   supertest = require("supertest-session")(app);
// Promise.promisifyAll(supertest);

// const   dbURI    = 'mongodb://localhost/st';
// const   util      = require('util');
// const   should   = require('chai').should();

// const   superAdminMail = 'superadmin@checkmai.com';
// const   SAPASSWORD = 'superadminpassword';


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
 
//     describe('multiply signups ,', function() {
//         function sendVendReq(email, password, passwordagain, i ){
//             describe('vendor reqs '+email, function(i){
//                 it(email+'  signup', function (done) {
//                     supertest
//                         .post('/signup')
//                         .send({ email: email, password: password, passwordagain: password })
//                         .end(function(err, res) {
//                             expect(res.status).to.equal(200);
//                             expect(res.body).to.have.property("message");
//                             expect(res.body.message).to.equal(ctM.LOGINED);
//                             done();
//                         });
//                 })
//                 it('become vendor '+email+', request /vendoreq', function (done) {
//                     supertest
//                         .post('/user/vendoreq')
//                         .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//                         .end(function(err, res) {
//                             expect(res.status).to.equal(200);
//                             expect(res.body).to.have.property("message");
//                             expect(res.body.message).to.equal(ctM.VENDOREQ);
//                             done();
//                         });
//                 })
//                 it('success logout /logout 200', function (done) {
//                     supertest
//                         .post('/logout')
//                         .send({})
//                         .end(function(err, res) {
//                             expect(res.status).to.equal(200);
//                             expect(res.body).to.have.property("message");
//                             expect(res.body.message).to.equal(ctM.LOGOUT_DONE);
//                             done();
//                         });
//                 })
//             });
//         }
//         Promise.coroutine(function *() {
//             function intializeDatabase(count){
//                 // let users = [];
//                 for(let z =0; z<count;z++){
//                     let uzer = {};
//                     uzer.email = randomstring.generate({ capitalization: 'lowercase' } )+'@gmail.com' 
//                     uzer.password = randomstring.generate() 
//                     users.push(uzer);
//                 }
//                 // return users;
//             }
//             // users = 
//                 intializeDatabase(usersCount);
//             log('IIIIIIIIIIIIIIII!!!!!!!!!!!!!!!!!!!!!!!!!1           '+ userRequestedForVendorRights.length );
//             yield Promise.map(users, function(theRandmUsr, i)  {
//                 let email = theRandmUsr.email;
//                 let password = theRandmUsr.password;
//                 // log(theRandmUsr);
//                 return new Promise((resolve,reject)=>{
//                     describe('vendor reqs '+email, function(i){
//                         it(email+'  signup', function (done) {
//                             supertest
//                                 .post('/signup')
//                                 .send({ email: email, password: password, passwordagain: password })
//                                 .end(function(err, res) {
//                                     userRequestedForVendorRights.push(res.body.savedusr);
//                                     expect(res.status).to.equal(200);
//                                     expect(res.body).to.have.property("message");
//                                     expect(res.body.message).to.equal(ctM.LOGINED);
//                                     done();
//                                 });
//                         })
//                         it('become vendor '+email+', request /vendoreq', function (done) {
//                             supertest
//                                 .post('/user/vendoreq')
//                                 .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//                                 .end(function(err, res) {
//                                     expect(res.status).to.equal(200);
//                                     expect(res.body).to.have.property("message");
//                                     expect(res.body.message).to.equal(ctM.VENDOREQ);
//                                     done();
//                                 });
//                         })
//                         it('success logout /logout 200', function (done) {
//                             supertest
//                                 .post('/logout')
//                                 .send({})
//                                 .end(function(err, res) {
//                                     expect(res.status).to.equal(200);
//                                     expect(res.body).to.have.property("message");
//                                     expect(res.body.message).to.equal(ctM.LOGOUT_DONE);
//                                     done();
//                                     resolve('!!!');
//                                 });
//                         })
//                     })
//                 })
//                 log(theRandmUsr);
//             }).then((f)=>{
//                 log( f instanceof Array);
//                 log('completed!!'+f);
//             });
//             log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%           ' );
//             log('IIIIIIIIIIIIIIII!!!!!!!!!!!!!!!!!!!!!!!!!1           '+ userRequestedForVendorRights.length );
//         })().catch(function(err) {
//             log(err);
//             done();
//         });

//     });
//     describe('allow/deni vendors, ', function(){
//         let useReq;
//         let i=0;
//         it('sets vendor roles', function () {
//             let agent = request.agent(app);
//             return agent
//             .post('/login')
//             .send({ email: superAdminMail, password: SAPASSWORD})
//             .expect(200)
//             .then(function (res) {
//                 return agent.get('/user/admin/adminpage').expect(200)
//             })
//             .then(function (res) {
//                 useReq = res.body.vendorreqs;
//                 i++;
//                 return agent
//                 .post('/user/admin/allovendor')
//                 .send({ vendreq: useReq[i], switchto: ModelsCt.VE_REQ_STATUS_ALLOWED })
//                 .expect(200);
//             }).then(function (res) {
//                 return agent
//                 .post('/user/admin/allovendor')
//                 .send({ vendreq: useReq[i+5], switchto: ModelsCt.VE_REQ_STATUS_DENIED, deniedescr: 'asdgwaeweb23ay4 34q 3qh3q5 hj3q5j q53j ' })
//                 .expect(200)
//             }).then(function (res) {
//                 expect(res.body.message).to.equal(ctM.VENDOR_RIGHTS_DENIED);
//             })
//         })
//     it('create purchase request', function () {
//         // log('usersCount   ',userRequestedForVendorRights[0]);
//         // log('users    ',users[0]);
//         // log('useReq   ',useReq[i]);
//         let agent = request.agent(app);
//         let noteId;
//         return agent
//         .post('/login')
//         .send({ email: users[0].email, password: users[0].password})
//         .expect(200)
//         .then(function (res) {
//             return agent.get('/user/usernotes').expect(200)
//         })
//         .then(function (res) {
//             noteId = res.body.notes[0]._id;
//             return agent.post('/user/setnotestate/'+res.body.notes[0]._id).expect(200)
//         }).then(function (res) {
//             return agent.delete('/user/setnotestate/'+noteId).expect(200)
//         }).then(function (res) {
//             return agent
//                 .post('/user/vendor/createp/')
//                 .send({description: 'fdsf', products: [3,4,5]})
//                 .expect(200)
//         }).then(function (res) {
//             log(res.body);
//                 log(res.body);
//                 log(res.body);
//                 log(res.body);
//                 log(res.body);
//             })


//             //     .then(function (res) {
//             //         useReq = res.body.vendorreqs;
//             //         i++;
//             //         return agent
//             //             .post('/user/admin/allovendor')
//             //             .send({ vendreq: useReq[i], switchto: ModelsCt.VE_REQ_STATUS_ALLOWED })
//             //             .expect(200);
//             //     }).then(function (res) {
//             //         return agent
//             //             .post('/user/admin/allovendor')
//             //             .send({ vendreq: useReq[i], switchto: ModelsCt.VE_REQ_STATUS_DENIED, deniedescr: 'asdgwaeweb23ay4 34q 3qh3q5 hj3q5j q53j ' })
//             //             .expect(200)
//             //     }).then(function (res) {
//             //             expect(res.body.message).to.equal(ctM.VENDOR_RIGHTS_DENIED);
//             //     }).then(function (res) {
//             // // log(res);
//             //         return agent.get('/user/admin/adminpage').expect(200)
//             //             // expect(res.body.message).to.equal(ctM.VENDOR_RIGHTS_DENIED);
//             //     })

//         })

//     });
// });

