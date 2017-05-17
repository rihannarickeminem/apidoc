'use strict';

import express from 'express';
import { admin } from '../controllers';
const route = new express.Router();

route
  .post('/allovendor', admin.allovendor)
  .get('/adminpage', admin.requests);

export default route;
