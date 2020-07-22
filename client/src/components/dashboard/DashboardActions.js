import React from 'react';
import { Link } from 'react-router-dom';
import { deleteAccount } from '../../action/profile';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const DashboardActions = ({ deleteAccount }) => {
  return (
    <div className='dashboardBtn'>
      <div class='dash-buttons'>
        <Link to='/edit-profile' class='btn btn-light'>
          <i class='fas fa-user-circle text-primary'></i> Edit Profile
        </Link>
        <Link to='/add-experience' class='btn btn-light'>
          <i class='fab fa-black-tie text-primary'></i> Add Experience
        </Link>
        <Link to='/add-education' class='btn btn-light'>
          <i class='fas fa-graduation-cap text-primary'></i> Add Education
        </Link>
        <Link to='/changePassword' class='btn btn-light'>
          <i class='fa fa-key text-primary' aria-hidden='true'></i> Change
          password
        </Link>
        <button className='btn btn-danger' onClick={() => deleteAccount()}>
          <i className='fas fa-user'></i> Delete My Account
        </button>
      </div>
    </div>
  );
};

DashboardActions.propTypes = {
  deleteAccount: PropTypes.func.isRequired,
};

export default connect(null, { deleteAccount })(DashboardActions);
