import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import CreateShopList from './CreateShopList';
import { fetchCategories } from '../actions/categories';
import { bindActionCreators } from 'redux';
import { fetchShopListRequest } from '../actions/shoplist';
// import {createProduct, deleteProduct} from '../actions/products';

// const socket = io('', { path: '/api/chat' });
const initialChannel = 'Lobby'; // NOTE: I hard coded this value for my example.  Change this as you see fit

class CreateShopListContainer extends Component {
  componentWillMount() {
    const {dispatch, categories } = this.props;
    dispatch(fetchCategories());
    if (this.props.location.pathname !== '/createp') {
      dispatch(fetchShopListRequest(this.props.location.pathname.split('/')[1]));
    }
  }

  render() {
    const { dispatch, categories} = this.props;
    return (
      <CreateShopList {...this.props}/>
    );
  }
}

CreateShopListContainer.propTypes = {
  categories: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
   return {
     categories: state.category.categories,
   }
}

export default connect(mapStateToProps)(CreateShopListContainer);
