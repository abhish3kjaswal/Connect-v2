import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { uploadAvatar } from '../../action/profile';

const UploadImages = ({ uploadAvatar, history }) => {
  let images1 = { picture: '' };
  let myWidget1 = window.cloudinary.createUploadWidget(
    {
      cloudName: 'mylibrary12345',
      uploadPreset: 'connect',
      cropping: 'server',
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        //console.log('result: ', result);
        images1.picture = result.info.secure_url;
        uploadAvatar(images1, history);
      }
    }
  );

  return (
    <Fragment>
      <h1 className='large text-primary'>Upload Display Picture</h1>{' '}
      <p className='lead'>For best results, crop image into a square.</p>
      <button
        className='btn btn-primary my-1'
        onClick={() => {
          myWidget1.open();
        }}
      >
        Upload Picture
      </button>
    </Fragment>
  );
};

UploadImages.propTypes = {
  uploadAvatar: PropTypes.func.isRequired,
};

export default connect(null, {
  uploadAvatar,
})(withRouter(UploadImages));
