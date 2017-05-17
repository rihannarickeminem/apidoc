import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut } from 'actions/users';
import { ENUM_VENDOR } from '../consts';

import classNames from 'classnames/bind';
import styles from 'css/components/navigation';

const cx = classNames.bind(styles);

const Navigation = ({ user, logOut }) => {
    return (
      <nav className={cx('navigation')} style={{display: 'flex', justifyContent: 'center'}} role="navigation">
      <div >
        { (user.authenticated && user.theUser.userRole.indexOf(ENUM_VENDOR) > -1) ? (
          <div className={cx('inline')}>
            <Link className={cx('createp')} to="createp">Create Shop List</Link>
          </div>
        ) : (
          null
        )}
        <Link to="/"
          className={cx('item', 'logo')}
          activeClassName={cx('active')}>Shopping Together !!!! SHOP with us!</Link>
          { user.authenticated ? (
          <div className={cx('inline')}>
            <Link className={cx('shoplist')} to="/shoppinlists">Shop Lists</Link>
            <Link onClick={logOut}
              className={cx('item')} to="/">Logout</Link>
          </div>
          ) : (
            <Link className={cx('item')} to="/login">Log in</Link>
          )}
      </div>
      </nav>
    );
};

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { logOut })(Navigation);
