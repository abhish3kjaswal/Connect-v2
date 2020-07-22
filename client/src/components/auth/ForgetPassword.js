import React, { Fragment, useState } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../action/auth';
import { setAlert } from '../../action/alert';
import { forgetPassword } from '../../action/auth';

const ForgetPassword = ({ setAlert, forgetPassword, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    password2: '',
  });

  const { email, newPassword, password2 } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== password2) {
      setAlert('Passwords do not match!!', 'danger', 3000);
    } else {
      forgetPassword(email, newPassword);
    }
  };

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <h1 class='large text-primary'>Forgot Password</h1>
      <p class='lead'>
        <i class='fas fa-user'></i> Enter correct email address
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
        <input type='submit' class='btn btn-primary' value='Update' />
      </form>
    </Fragment>
  );
};

ForgetPassword.propTypes = {
  forgetPassword: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, forgetPassword })(
  ForgetPassword
);
