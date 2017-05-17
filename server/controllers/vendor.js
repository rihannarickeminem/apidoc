'use strict';
import debug from 'debug';
import Promise from 'bluebird';
import fs from 'fs-extra';
import error from '../errors';
import Product from '../models/product';
import Purchase from '../models/purchases';
import * as ct from '../errors/consts';

// eslint-disable-next-line no-unused-vars
const log = debug('server:VENDOR CONTROLLER');

Promise.promisifyAll(fs);

function saveProduct(product) {
  const theProduct = new Product({
    productName: product.productName,
    description: product.description,
    productCode: product.productCode,
    integer: product.integer,
    price: product.price,
    availableCount: product.availableCount,
    pictures: product.pictures,
  });
  return theProduct.save();
}
function removeShopList(ID) {
  return Purchase.findOneAndRemove({ _id: ID })
    .then(() => Product.remove({ shopListId: ID }));
}
function createp(ProductsIds, description) {
  const purchase = new Purchase({
    purchaseTitle: description.purchaseTitle,
    vendor: description.vendor,
    description: description.description,
    purchaseCategory: description.purchaseCategory,
    finishingDate: description.finishingDate,
    condition: description.condition,
    conditionValue: description.conditionValue,
    pictures: description.pictures,
    productsIDs: ProductsIds,
    'status.process': true,
  });
  return purchase.save();
}
function ownlists(vendorId, page, limit) {
  return Purchase.find({ vendor: vendorId }).skip(limit * (page - 1)).limit(limit);
}
function resavePic(picPath, destPath) {
  return fs.copyAsync(picPath, destPath).catch(() => {
    throw new error.VendorError(ct.SL_PIC_ERR_DURING_SAVE);
  });
}
function createFolder(path) {
  return fs.mkdirAsync(path);
}
function editShopList(query, shoplist) {
  return Purchase.update(
    query,
    { $set: shoplist }
  );
}
function removeProduct(productID) {
  return Product.remove({ _id: productID });
}
function editProduct(query, product) {
  return Product.update(
    query,
    { $set: product }
  );
}
export default {
  editShopList,
  createFolder,
  createp,
  ownlists,
  resavePic,
  saveProduct,
  removeShopList,
  removeProduct,
  editProduct,
};
