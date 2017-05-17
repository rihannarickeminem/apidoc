import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { logOut } from 'actions/users';
import { fetchCategories } from '../actions/categories';

import classNames from 'classnames/bind';
import stylesz from 'css/components/landing';

const cx = classNames.bind(stylesz);
class Landing extends Component {
  // static need = [ // eslint-disable-line
  // fetchCategories,
  // ]
// static propTypes = {
//   user: PropTypes.object,
//   categories: PropTypes.object.isRequired,
// };
  render() {
    const { user } = this.props;
    return (
      <div className={cx('landing')} role="landing">
        <div style={{display: 'flex', justifyContent: 'center'}}>
          { user.authenticated ? (
          <div className="row vertical-center-row">You can shopping together!!!</div>
          ) : (
          <div>Enter to start shopping together with us !</div>
          )}
        </div>
      </div>
    );
  }
}
Landing.propTypes = {
  // categories: PropTypes.object.isRequired,
  user: PropTypes.object,
};
function mapStateToProps(state) {
  return {
    // user
    user: state.user,
    // categories: state.category.categories,
  };
}

export default connect(mapStateToProps)(Landing);
