import React, { Component, PropTypes } from 'react';

import ReactDOM from 'react-dom';
import classNames from 'classnames/bind';
import styles from 'css/components/create-sl';
import { Input, Modal, Radio, FormControl, Checkbox, HelpBlock, ControlLabel, FormGroup, DropdownButton, MenuItem, Button, ButtonGroup, Navbar, NavDropdown, Nav, NavItem } from 'react-bootstrap';
const cx = classNames.bind(styles);
// import { fetchShopListRequest } from '../actions/shoplist';

const ShopListInfo = (props) => {
  const {categories, changeCondition} = props;
  // if (props.location.pathname === '/createp') {
  //  dispatch(fetchShopListRequest(props.location.pathname.split('/')[1]));
  //  props.shoplist.isEditing = true;
  // }
  const isEditing = props.shoplist.isEditing;
  let Categories = [];
  if(typeof categories.categories !== 'undefined' && categories.categories.length > 0) {
    Categories = categories.categories.map((category, key) => { return (
        <option value={category._id} key={category._id}>{category.categoryName}</option>);
    });
  }
  // if (isEditing) {
    return (
        <div className={cx('create-shop-list')} style={{display: 'flex', flexDirection: 'column',
          alignItems: 'flex-end', order: '0',
            flex: '1 1 auto'}}>
          <Button bsStyle='info' className={cx('form-flex-margin')} style={{order: '0', flex: '1 1 auto', marginLeft: 'auto', marginBottom: '5px'}} type="submit">
            Create Shop List
          </Button>
          <div className={cx('wrap-blocks_max-width')} style={{order: '1', flex: '1 1 auto', padding: '5px', flexWrap: 'wrap', display: 'flex'}}>
            <FormGroup className={cx('form-flex-margin')} style={{marginRight: '105px', order: '0', flex: '1 1 auto', width: '40%'}} validationState="success">
              <ControlLabel>Shop List Title</ControlLabel>
              <FormControl id='newShopList-Title' type='text' defaultValue='title the title the'  />
            </FormGroup>
            <FormGroup style={{order: '1', flex: '1 1 auto', width: '20%'}} className={cx('form-flex-margin')} validationState='success'>
              <ControlLabel>Finishing Date</ControlLabel>
              <FormControl id='newShopList-finishing-date' style={{fontSize: '10px'}} type='date' />
            </FormGroup>
            <div style={{order: '2', flex: '1 1 100%', width: '100%'}}>
            </div>
            <FormGroup className={cx('form-flex-margin')} style={{marginRight: '35px', order: '3', flex: '1 1 auto', width: '46%'}}>
              <ControlLabel>Shop List Description</ControlLabel>
              <FormControl className={cx('textarea-sizes')} id='newShopList-description' componentClass="textarea" defaultValue='sadfsaf2a3g4aawgsdsdg' placeholder="Description" style={{maxWidth: '470px', height: '150px'}} />
            </FormGroup>
            <div className={cx('form-flex-margin')} style={{order: '3', flex: '1 1 auto', width: '20%'}}>
              <label htmlFor='PRICE'>Purchase will be completed if overall amount is done
                <input style={{marginLeft: '10px'}} type="radio" id='PRICE' value='PRICE' onChange={changeCondition} name="slRadioCondition"/>
              </label>
              <label htmlFor='MEMBERS'>Number of participants is needed</label>
              <input style={{marginLeft: '10px'}} type="radio" id='MEMBERS' value='MEMBERS' onChange={changeCondition} name="slRadioCondition"/>
              <label htmlFor='CONDITION_VALUE'>Condition Amount</label>
              <input style={{marginLeft: '10px', width: '100px'}} type="text" id='CONDITION_VALUE' />
            </div>
            <div style={{order: '4', flex: '1 1 100%', width: '100%'}}>
            </div>
            <div className={cx('form-flex-margin')} style={{order: '5', flex: '1 1 auto', maxWidth: '401px'}}>
              <label  htmlFor="slCategory">Purchase category</label>
                <select id='slCategory' className='form-control' >
                  {Categories}
                </select>
            </div>
            <div style={{order: '6', flex: '1 1 100%', width: '100%'}}>
            </div>
          </div>
      </div>
    );
  // }
  // console.log('isEditing   ', props.shoplist.shoplist.info);
  // console.log('isEditing   ', props.shoplist.shoplist.info);
  // console.log('isEditing   ', props.shoplist.shoplist.info);
  // console.log('isEditing   ', props.shoplist.shoplist.info);
  // const shopListInfo = props.shoplist.shoplist.info;
  // console.log('shopListInfo     ', shopListInfo);
  // console.log('shopListInfo     ', shopListInfo);
  // console.log('shopListInfo     ', shopListInfo);
  // console.log('shopListInfo     ', shopListInfo);
  //  return (
  //    <div className={cx('dispay-shop-list')} style={{display: 'flex', flexDirection: 'column',
  //      alignItems: 'flex-end', order: '0',
  //        flex: '1 1 auto'}}>
  //      <div className={cx('wrap-blocks_max-width')} style={{order: '1', flex: '1 1 auto', padding: '5px', flexWrap: 'wrap', display: 'flex'}}>
  //        <div className={cx('form-flex-margin')} style={{marginRight: '105px', order: '0', flex: '1 1 auto', width: '40%'}}>
  //          {(typeof shopListInfo!== 'undefined' && typeof shopListInfo.description !== 'undefined') ? shopListInfo.description : null}
  //        </div>
  //      </div>
  //    </div>
  //  );
};

ShopListInfo.propTypes = {
  categories: PropTypes.object.isRequired,
  changeCondition: PropTypes.func.isRequired,
};

export default ShopListInfo;
