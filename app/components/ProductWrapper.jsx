import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/create-sl';
import DropzoneComponent from 'react-dropzone-component';
import {changeProductCode} from '../actions/products';

const cx = classNames.bind(styles);


export default class ProductWrapper extends Component {
  onFeildChange(product, event) {
    const {...props} = this.props;
    event.preventDefault();
    if (event.target.id.split('_')[0] === 'product-name') {
      console.log('event.target.id   ', event.target.id.split('_')[0]);
    }
    if (event.target.id.split('_')[0] === 'product-code') {
      console.log('event.target.id   ', event.target.id.split('_')[0]);
      return this.props.dispatch(changeProductCode(product, event.target.value));
    }
  }
  render() {
    const {product, keyz, ...props} = this.props;
    const componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      uploadMultiple: true,
      postUrl: '/user/vendor/upload_image'
    };
    const djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif'
    };
    const uploadS = function (f) {
      let picsLength = product.paramsToSend.pictures.length;
      if (++picsLength > 5) {
        return;
      }
      product.paramsToSend.pictures.push(JSON.parse(f.xhr.response).newPath);
    };
    const eventHandlers = {
      // All of these receive the event as first parameter:
      drop: null,
      dragstart: null,
      dragend: null,
      dragenter: null,
      dragover: null,
      dragleave: null,
      // All of these receive the file as first parameter:
      addedfile: null,
      removedfile: null,
      thumbnail: null,
      error: null,
      processing: null,
      uploadprogress: null,
      sending: null,
      success: uploadS,
      complete: null,
      canceled: null,
      maxfilesreached: null,
      maxfilesexceeded: null,
      // All of these receive a list of files as first parameter
      // and are only called if the uploadMultiple option
      // in djsConfig is true:
      processingmultiple: null,
      sendingmultiple: null,
      successmultiple: null,
      completemultiple: null,
      canceledmultiple: null,
      // Special Events
      totaluploadprogress: null,
      reset: null,
      queuecompleted: null
    };
    return (
      <div style={{order: `${keyz}`}} className={cx('product-wrap_flex-column_align-center')}>
          <div className={cx('wrap-blocks_max-width', 'wrap-blocks_max-width_left-row')}>
            <div className={cx('product-count')} style={{color: 'blue'}}>
              {keyz}
            </div>
            <div className={cx('delete-product')} onClick={this.props.onRemoveProduct} style={{color: 'chucknorris'}}>
              X
            </div>
           <div style={{order: '0', display: 'flex', flexDirection: 'row', marginRight: '20px', flex: '1 1 60%', flexWrap: 'wrap', width: '20%'}}>
             <div style={{marginRight: '20px', order: '0', flex: '1 1 auto', width: '60%'}}>
               <label htmlFor={product.ProductNameId}>Product Name:</label>
               <input type="text" className={cx('product-name', 'form-control')} id={product.ProductNameId}/>
             </div>
             <div style={{order: '1', flex: '1 1 auto', width: '10%'}}>
               <label htmlFor={product.ProductCodeId}>Product Code:</label>
               <input type="text" onChange={this.onFeildChange.bind(this, product)} className={cx('product-code', 'form-control')} defaultValue={product.defaultCode} maxLength='5' id={product.ProductCodeId}/>
             </div>
             <div style={{order: '2', flex: '1 1 100%', width: '100%'}}>
             </div>
             <div style={{order: '3', flex: '1 1 auto', width: '100%', marginBottom: '10px'}}>
               <label htmlFor={product.ProductDescriptionId}>Product Description:</label>
               <textarea className={cx('product-description', 'form-control', 'textarea-sizes')} placeholder='Product description' id={product.ProductDescriptionId} style={{maxWidth: '470px', height: '150px'}}/>
             </div>
             <label style={{order: '4', width: '100%', flex: '1 1 auto'}}><input type="checkbox" id={product.isIntegerID} value="integer"/>goods measured in whole numbers</label>
             <label style={{order: '5', flex: '1 1 auto', width: '50%'}} ><input placeholder="Price per item" type="text" id={product.priceID} /> $ </label>
             <label style={{order: '6', flex: '1 1 auto', width: '50%'}} ><input type="text" placeholder="available items count" id={product.availableCountID} /> count </label>
           </div>
           <div style={{order: '1', display: 'flex', flexDirection: 'row', flex: '1 1 40%', flexWrap: 'wrap'}}>
             <DropzoneComponent
               eventHandlers={eventHandlers}
               djsConfig={djsConfig}
               config={componentConfig} />
           </div>
          </div>
      </div>
    );
  }
}
