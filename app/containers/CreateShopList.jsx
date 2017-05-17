import React, { Component, PropTypes } from 'react';
import crypto from 'crypto';

import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/create-sl';
import ShopListInfo from 'components/ShopListInfo';
import ProductWrapper from 'components/ProductWrapper';
import {createProduct, deleteProduct} from '../actions/products';
import {createShopList} from '../actions/shoplist';

const cx = classNames.bind(styles);

class CreateShopList extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleOnSubmit = this.handleOnSubmit.bind(this);
    this.changeCondition = this.changeCondition.bind(this);
    this.selectedCondition = 'MEMBERS';
    // this.listProducts= [];
  }
  changeCondition(event) {
   if (event.target.name === 'slRadioCondition') {
     this.setState({ selectedCondition: event.target.value });
   }
  }
  deleteNewProduct(product, e) {
    e.preventDefault();
    let products_length = this.props.products.length;
    const { dispatch } = this.props;
    return dispatch(deleteProduct(product.defaultCode, products_length));
  }
  addNewProduct(e) {
    e.preventDefault();
    let products_length = this.props.products.length;
    const { dispatch } = this.props;
    return dispatch(createProduct(products_length));
  }
  handleOnSubmit(event) {
    const {dispatch, products, user} = this.props;
    event.preventDefault();
    const form = event.target;
    const purchaseTitle = form.querySelector('[id="newShopList-Title"]').value;
    const description = form.querySelector('[id="newShopList-description"]').value;
    const purchaseCategory = form.querySelector('[id="slCategory"]').value;
    const finishingDate = new Date(form.querySelector('[id="newShopList-finishing-date"]').value).getTime();
    const condition = this.selectedCondition;
    const conditionValue = form.querySelector('[id="CONDITION_VALUE"]').value;
    const productsToSend = products.map((product, i) =>
       Object.assign(product.paramsToSend,
         { productName: form.querySelector(`[id='${product.ProductNameId}']`.toString()).value},
         { productCode: product.defaultCode },
         { description: form.querySelector(`[id='${product.ProductDescriptionId}']`.toString()).value},
         { integer: form.querySelector(`[id='${product.isIntegerID}']`.toString()).checked},
         { price: parseInt(form.querySelector(`[id='${product.priceID}']`.toString()).value, 10)},
         { availableCount: parseInt(form.querySelector(`[id='${product.availableCountID}']`.toString()).value, 10)},
        )
      )
    const shoplist = {
      purchaseTitle,
      description,
      purchaseCategory,
      finishingDate,
      condition,
      conditionValue,
    };
    return dispatch(createShopList({shoplist, products: productsToSend}));
  }
  renderProducts(products) {
    return (
      <div className="product-wrapper">{products.map((product, i) =>
        <ProductWrapper onRemoveProduct={this.deleteNewProduct.bind(this,product)}
          className="the-product" key={product.defaultCode} keyz={i+1}
          product={product} {...this.props} changeCondition={this.changeCondition}/>
      )}</div>
    );
  }
  render() {
    const {categories, shoplist, dispatch, products, ...props, user: {message} } = this.props;
    return (
      <form onSubmit={this.handleOnSubmit} style={{ paddin: '5px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        flexWrap: 'wrap', alignContent: 'stretch', justifyContent: 'center'}}>
        <p className={cx('message', {
          'message-show': message && message.length > 0
          })}>{message}</p>
        <ShopListInfo categories={categories} shoplist={shoplist} changeCondition={this.changeCondition} />
      { this.renderProducts(products)}
        <button className="add-product-button, btn-primary"
        onClick={this.addNewProduct.bind(this)}>Add Product +</button>
      </form>
    )
  }
}

CreateShopList.propTypes = {
    products: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    shoplist: PropTypes.object.isRequired,
};
function mapStateToProps(state) {
  return {
    user: state.user,
    products: state.products,
    shoplist: state.shoplist,
  };
}
export default connect(mapStateToProps)(CreateShopList);
