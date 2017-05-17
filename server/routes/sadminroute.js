import express from 'express';
import { sadmin } from '../controllers';
const route = new express.Router();

route
  .post('/addpcat', sadmin.addCategory)
  .post('/addrole', sadmin.addrole)
  .get('/sapusers', sadmin.sapusers);

export default route;
