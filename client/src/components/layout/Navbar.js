import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../action/auth';
//import auth from '../../reducers/auth';
const navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          <i class='fa fa-users' aria-hidden='true'></i>
          <span className='hide-sm'> People</span>
        </Link>
      </li>
      <li>
        <Link to='/posts'>
          <i class='fa fa-pencil-square-o' aria-hidden='true'></i>{' '}
          <span className='hide-sm'>Posts</span>
        </Link>
      </li>
      <li>
        <Link to='/my-messages'>
          <i class='fa fa-envelope-o' aria-hidden='true' />{' '}
          <span className='hide-sm'>Mailbox</span>
        </Link>
      </li>
      <li>
        <Link to='/dashboard'>
          <i className='fas fa-user' />{' '}
          <span className='hide-sm'>Dashboard</span>
        </Link>
      </li>
      <li>
        <Link onClick={logout} to='/'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>
          <i class='fa fa-users' aria-hidden='true'></i> People
        </Link>
      </li>
      <li>
        <Link to='/register'>
          <i class='fa fa-user-plus' aria-hidden='true'></i> Register
        </Link>
      </li>
      <li>
        <Link to='/login'>
          <i class='fa fa-sign-in' aria-hidden='true'></i> Login
        </Link>
      </li>
    </ul>
  );
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code'></i> Connect
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

navbar.propTypes = {
  logout: PropTypes.func.isRequired,
};
export default connect(mapStateToProps, { logout })(navbar);
