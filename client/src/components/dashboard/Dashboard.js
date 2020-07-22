import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../action/profile';
import Spinner from '../layout/spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import DashboardPost from './DashboardPost';
import PostForm from '../posts/PostForm';

const Dashboard = ({
  getCurrentProfile,
  auth: { user },
  profile: { profile, loading },
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);
  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <div>
        <h1 className='large text-primary'>
          <i class='fa fa-user-circle' aria-hidden='true'></i> Dashboard
        </h1>

        <div className='profile-top bg-primary p-2'>
          <img
            className='round-img my-1'
            style={{ width: '150px' }}
            src={user && user.avatar}
            alt='user snap...'
          />
          {'      '}
          <p className='lead'>
            <b>WELCOME {user && user.name.toUpperCase()}</b>
          </p>
        </div>
        {profile !== null ? (
          <Fragment>
            <DashboardActions />
            <br />
            <div>
              {' '}
              <PostForm></PostForm>
            </div>

            <div className='profile-grid my-1'>
              <div className='profile-exp bg-white' style={{ padding: '10px' }}>
                <Experience experience={profile.experience} />
              </div>{' '}
              <div
                className='profile-edu bg-white '
                style={{ padding: '10px' }}
              >
                <Education education={profile.education} />
              </div>
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <p>please add some information and create your profile...</p>
            <Link to='/create-profile' className='btn btn-primary my-1'>
              Create profile
            </Link>
          </Fragment>
        )}
        <DashboardPost />
      </div>
    </Fragment>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard);
