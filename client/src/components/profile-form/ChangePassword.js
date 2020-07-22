import React, { Fragment, useState, useEffect } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../action/alert';
import { changePassword } from '../../action/profile';
import { getCurrentProfile } from '../../action/profile';

const ChangePassword = ({ setAlert, changePassword, profile, history }) => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    password2: '',
    oldPassword: '',
  });

  const { email, newPassword, password2, oldPassword } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== password2) {
      setAlert('Passwords do not match!!', 'danger', 3000);
    } else {
      changePassword(email, newPassword, oldPassword, history);
    }
  };
  return (
    <Fragment>
      <h1 class='large text-primary'>Change Password</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Enter your email address
      </p>
      <form class='form' onSubmit={(e) => onSubmit(e)} action='dashboard.html'>
        <div class='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div class='form-group'>
          <input
            type='password'
            placeholder='Current Password'
            name='oldPassword'
            value={oldPassword}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <div class='form-group'>
          <input
            type='password'
            placeholder='New Password'
            name='newPassword'
            value={newPassword}
            onChange={(e) => onChange(e)}
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            value={password2}
            onChange={(e) => onChange(e)}
            name='password2'
            minLength='6'
          />
        </div>
        <input type='submit' class='btn btn-primary' value='Update' />{' '}
        <a href='/dashboard' class='btn btn-grey'>
          Go back
        </a>
      </form>
    </Fragment>
  );
};

ChangePassword.propTypes = {
  changePassword: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  profile: state.profile,
});
export default connect(mapStateToProps, { setAlert, changePassword })(
  withRouter(ChangePassword)
);
