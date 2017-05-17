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


// const log = debug('server:test-server');
// const app = require("../server/index");
// const   supertest = require("supertest-session")(app);
// const   dbURI    = 'mongodb://localhost/st';
// const   util      = require('util');
// const   should   = require('chai').should();

// const   checkMail_user = 'tobi@gmail.com';
// const   password = 'tobi352@Fafwasf2'; 
// const   passwordagain = 'tobi352@Fafwasf2';
// const   AdminMail = 'admin@checkmai.com';
// const   superAdminMail = 'superadmin@checkmai.com';
// const   SAPASSWORD = 'superadminpassword';

// const   expect = require('chai').expect;



// let userCountArray = [];
// let Vendors = [];
// let Admins = [];
// let UuserCountArray =[];
// const usersCount = 450;
// describe('cheks', function(){
//     before(function(done) {


//         function intializeDatabase(count){
//             for(let i =0; i<count;i++){
//                 let uzer = {};
//                     uzer.email = randomstring.generate({ capitalization: 'lowercase' } )+'@gmail.com' 
//                     uzer.password = randomstring.generate() 
//                 if(i<20){
//                     uzer.isVendor = {
//                         fullName: randomstring.generate(),
//                         phoneNumber: Date.now(),
//                         description: randomstring.generate() 
//                     }
//                 }
//                     userCountArray.push(uzer);
//             }
//         }

//         Promise.coroutine(function *() {
//         let collections = ['categories', 'users', 'sessions', 'vendorequests', 'usernotes'];
//             yield Promise.map(collections, collection => {
//                 mongoose.connection.db.dropCollection(collection);
//             }) 
//             yield* intializeDatabase(usersCount);
//             yield Promise.map(userCountArray,function(theRandmUsr)  {
//                 let user = new User({email: theRandmUsr.email, password: theRandmUsr.password, isVendor: theRandmUsr.isVendor });
//                 UuserCountArray.push(user);
//                 if(typeof user.isVendor !== 'undefined' && typeof user.isVendor.fullName !== 'undefined'){
//                     Vendors.push(user);
//                 }
//                 user.save();
//             })
//             let existCat = [tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME3];
//             yield Promise.map(existCat,function(categoryname)  {
//                 let category = new categories({categoryName: categoryname});
//                 category.save();
//             })
//             const user = new User({email: superAdminMail, password: SAPASSWORD, role: [ ModelsCt.ENUM_SUPER_ADMIN ] });
//             let oneUser = yield user.save();
//             done();
//         })().catch(function(err) {
//             log(err);
//             done();
//         });
//     });
//     describe('roomy APIs,', function() {
//         it('get purchase categories', function (done) {
//             supertest
//             .get('/roomy/pcategories')
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("categories");
//                 expect(res.body.categories).to.be.instanceof(Array);
//                 done();
//             });
//         })
//     });
//     describe('user APIs,', function() {


//         before(function(done) {
//             done();
//         });
//         after(function(done){
//             done();
//         });
//         it('access Super Admin API without auth, fail check "Not Authorised"', function (done) {
//             supertest
//             .post('/user/addpcat')
//             .send({ categories: [tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME3] })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.NOT_AUTHORISED);
//                 done();
//             });
//         })
//         it('signup', function (done) {
//             supertest
//             .post('/signup')
//             // .send({ email:checkMail_user, password: password, passwordagain: passwordagain })
//             .send({ email:checkMail_user, password:password, passwordagain:  password })
//             .end(function(err, res) {
//                 log(res.body);
//                 log(res.body);
//                 log(res.body);
//                 userCountArray.push(res.body.savedusr);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.LOGINED);
//                 done();
//             });
//         })
//         // it('signup fail couse pass length', function (done) {
//         //     supertest
//         //     .post('/signup')
//         //     .send({ email:checkMail_user, password: password, passwordagain: passwordagain })
//         //     .end(function(err, res) {
//         //         userCountArray.push(res.body.savedusr);
//         //         expect(res.status).to.equal(200);
//         //         expect(res.body).to.have.property("message");
//         //         expect(res.body.message).to.equal(ctM.LOGINED);
//         //         done();
//         //     });
//         // })
//         it('access admin page without admin rights fail', function (done) {
//             supertest
//             .get('/user/admin/adminpage')
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.NOT_AN_ADMIN);
//                 done();
//             });
//         })
//         it('success logout /logout 200', function (done) {
//             supertest
//             .post('/logout')
//             .send({})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.LOGOUT_DONE);
//                 done();
//             });
//         })
//         it('req to super admin api, must fail with not "authorised error"', function (done) {
//             supertest
//             .post('/user/sadmin/addpcat')
//             .send({ categories: [tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME2, tCt.CATEGORY_NAME3, tCt.CATEGORY_NAME4] })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.NOT_AUTHORISED);
//                 done();
//             });
//         })
//         it('existing user /signup 400 ', function (done) {
//             supertest
//             .post('/signup')
//             .send({ email: checkMail_user, password: password, passwordagain: passwordagain })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.USEREXISTS);
//                 done();
//             });
//         })
//         it('uncorrect email /signup 400', function (done) {
//             supertest
//             .post('/signup')
//             .send({ email: 'dsfaw3gwge', password: password, passwordagain: passwordagain })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.EMAIL_OR_PASSWORD_NOT_VALID);
//                 done();
//             });
//         })
//         it('passwords dismatch signup /signup 400', function (done) {
//             supertest
//             .post('/signup')
//             .send({ email: checkMail_user, password: password, passwordagain: 'match'+passwordagain })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.PASSDIFFER);
//                 done();
//             });
//         })
//         it('success login /login 200', function (done) {
//             supertest
//             .post('/login')
//             .send({ email: checkMail_user, password: password})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.LOGINED);
//                 done();
//             });
//         })
//         it(' wrong pass  /login 400', function (done) {
//             supertest
//             .post('/login')
//             .send({ email: checkMail_user, password: 'wrond'+password})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.L_E_WRONG_PASS);
//                 done();
//             });
//         })
//         it(' no such user  /login 400', function (done) {
//             supertest
//             .post('/login')
//             .send({ email: 'er3'+checkMail_user, password: password})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.L_E_NO_SUCH_USER);
//                 done();
//             });
//         })
//         it('become vendor request /vendoreq', function (done) {
//             supertest
//             .post('/user/vendoreq')
//             .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.VENDOREQ);
//                 done();
//             });
//         })
//     });
//     // describe('vendorUser APIs,', function() {
//     //     it('creates new purchase', function (done) {
//     //         supertest
//     //             .post('/createp')
//     //             .send({ fullname: 'Jack', phonenumber: 9879878797, description: 'descripthin , the' })
//     //             .end(function(err, res) {
//     //                 expect(res.status).to.equal(200);

//     //                 expect(res.body).to.have.property("message");
//     //                 expect(res.body.message).to.equal(ctM.VENDOREQ);
//     //                 done();
//     //             });
//     //     })
//     // });
//     describe('superadmin  APIs,', function() {

//         before(function(done) {
//             Promise.coroutine(function *() {
//                 yield mongoose.connection.db.dropCollection('sessions');
//                 done();
//             })().catch(function(err) {
//                 done();
//             });
//         });
//         after(function(done){
//             done();
//         });
//         it('access Super Admin API without rights, fail check', function (done) {
//             supertest
//             .post('/user/sadmin/addpcat')
//             .send({ categories: [tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME3] })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.NOT_AUTHORISED);
//                 done();
//             });
//         })
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
//         it('add pCat, all categories exist', function (done) {
//             supertest
//             .post('/user/sadmin/addpcat')
//             .send({ categories: [tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME3] })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.CATEGORIES_EXIST_ALL);
//                 done();
//             });
//         })
//         it('add pCat, some added, some exists', function (done) {
//             supertest
//             .post('/user/sadmin/addpcat')
//             .send({ categories: ['asdfasfas', tCt.CATEGORY_NAME1, tCt.CATEGORY_NAME2, tCt.CATEGORY_NAME3, tCt.CATEGORY_NAME4] })
//             .end(function(err, res) {
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.CATEGORIES_ADDED);
//                 expect(res.body).to.have.property("existmes");
//                 expect(res.body.existmes).to.have.equal(ctM.CATEGORIES_EXIST_SOME);
//                 expect(res.body).to.have.property("added");
//                 expect(res.body.added).to.have.lengthOf(3);
//                 expect(res.body).to.have.property("existar");
//                 expect(res.body.existar).to.have.lengthOf(2);
//                 done();
//             });
//         })
//         it('set user role: Error with not valid req', function (done) {
//             supertest
//             .post('/user/sadmin/addrole')
//             .send({ addroleto: { }})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.NO_PARAMS_RECIEVED);
//                 done();
//             });
//         })
//         it('fail set user role couse of L_E_NO_SUCH_USER ', function (done) {
//             supertest
//             .post('/user/sadmin/addrole')
//             .send({ addroleto: { email: 'therssfasfandom@mail.com', role: ModelsCt.ENUM_ADMIN }})
//             .end(function(err, res) {
//                 // log(res.body);
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.L_E_NO_SUCH_USER);
//                 done();
//             });
//         })
//         it('super admin, get users for one page', function (done) {
//             supertest
//             .get('/user/sadmin/sapusers')
//             .end(function(err, res) {
//                 // log(res.body.users[0].role);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("users");
//                 expect(res.body.users).to.be.an.instanceof(Array);
//                 expect(res.body.users).to.have.lengthOf(15);
//                 done();
//             });
//         })
//         it('super admin, get users for third page ', function (done) {
//             supertest
//             .get('/user/sadmin/sapusers')
//             .send({sapage: 3})
//             .end(function(err, res) {
//                 // log(res.body.users[0].role);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("users");
//                 expect(res.body.users).to.be.an.instanceof(Array);
//                 expect(res.body.users).to.have.lengthOf(15);
//                 expect(res.body).to.have.property("page");
//                 expect(res.body.page).to.equal(3);
//                 done();
//             });
//         })
//         it('set user role', function (done) {
//             supertest
//             .post('/user/sadmin/addrole')
//             .send({ addroleto: { email: checkMail_user, role: ModelsCt.ENUM_ADMIN }})
//             .end(function(err, res) {
//                 let uz = {
//                     email : checkMail_user ,
//                         password : password
//                 }
//                 Admins.push(uz);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("message");
//                 expect(res.body.message).to.equal(ctM.ROLE_CHANGED);
//                 expect(res.body).to.have.property("uscuroles");
//                 expect(res.body.uscuroles).to.be.instanceof(Array);
//                 // expect(res.body.reqs).to.be.instanceof(Array);
//                 done();
//             });
//         })
//         for(let i =0; i<5;i++){
//             it('set admin rights for 5 users', function (done) {
//             let ii = 70+i;
//                 supertest
//                 .post('/user/sadmin/addrole')
//                 .send({ addroleto: { email: UuserCountArray[ii].email, role: ModelsCt.ENUM_ADMIN }})
//                 .end(function(err, res) {
//                     UuserCountArray[ii].role = res.body.uscuroles;
//                     Admins.push(UuserCountArray[ii]);
//                     expect(res.status).to.equal(200);
//                     expect(res.body).to.have.property("message");
//                     expect(res.body.message).to.equal(ctM.ROLE_CHANGED);
//                     expect(res.body).to.have.property("uscuroles");
//                     expect(res.body.uscuroles).to.be.instanceof(Array);
//                     done();
//                 });
//             })
//         }
//         it('super admin, get users filtered by ADMINS for one page', function (done) {
//             supertest
//             .get('/user/sadmin/sapusers')
//             .send({ sapfilter: ModelsCt.ENUM_ADMIN})
//             .end(function(err, res) {
//             // log(res.body.users[0]);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("users");
//                 expect(res.body.users).to.be.an.instanceof(Array);
//                 done();
//             });
//         })
//         it('uncorrect role ENUM value, error', function (done) {
//             supertest
//             .post('/user/sadmin/addrole')
//             .send({ addroleto: { email: checkMail_user, role: 'sdfsdf' }})
//             .end(function(err, res) {
//                 expect(res.status).to.equal(400);
//                 expect(res.body).to.have.property("err");
//                 expect(res.body.err).to.equal(ct.DB_ERROR);
//                 done();
//             });
//         })
//         it('access admin/super-admin page with super-admin rights - success', function (done) {
//             supertest
//             .get('/user/admin/adminpage')
//             .end(function(err, res) {
//                 // log(res.body);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("vendorreqs");
//                 expect(res.body.vendorreqs).to.be.instanceof(Array);
//                 // expect(res.body.vendorreqs).to.have.lengthOf(1);
//                 done();
//             });
//         })
//     });
//     describe('roomy APIs,', function() {
//         it('get purchase categories', function (done) {
//             supertest
//             .get('/roomy/pcategories')
//             .end(function(err, res) {
//                 // log(res.body);
//                 expect(res.status).to.equal(200);
//                 expect(res.body).to.have.property("categories");
//                 expect(res.body.categories).to.be.instanceof(Array);
//                 // expect(res.body.vendorreqs).to.have.lengthOf(Vendors.length+1);
//                 done();
//             });
//         })
//     });
//     describe('administrator  APIs,', function() {

//         // it('allow 10 vendors', function (done) {
//         //     supertest
//         //     .get('/roomy/pcategories')
//         //     .end(function(err, res) {
//         //         // log(res.body);
//         //         expect(res.status).to.equal(200);
//         //         expect(res.body).to.have.property("categories");
//         //         expect(res.body.categories).to.be.instanceof(Array);
//         //         // expect(res.body.vendorreqs).to.have.lengthOf(Vendors.length+1);
//         //         done();
//         //     });
//         // })
//     });
// });
