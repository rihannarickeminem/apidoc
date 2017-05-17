import express from 'express';
import { roomy } from '../controllers';
const route = new express.Router();

route
  .get('/pcategories', roomy.pcategories);
// .get('/pcategory',
// .get('/pcatigories:id', roomy.pcatigory)
// .get('/vendorpc:id', roomy.pcatigory)
// .get('/pcatigory',  roomy.pcatigory)
// .get('/vendorsgoods', roomy.vendorsgoods)

export default route;
