import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Message = ({ auth, profile: { profile, loading } }) => {
  console.log(auth.user);
  console.log(profile);
  return (
    <Fragment>
      <div style={{}}>
        <form className='form'>
          <div class='form-group'>
            <input type='text' placeholder='Write a message...'></input>
          </div>

          <input class='btn btn-primary' type='submit' value='Send' />
        </form>
      </div>
      <div
        style={{
          borderStyle: 'groove',
          padding: '10px',
          marginTop: '15px',
          height: '600px',
        }}
      ></div>
    </Fragment>
  );
};

Message.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, {})(Message);
