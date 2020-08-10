import React, { Fragment, useEffect } from 'react';

import Login from '../auth/Login';
import ForgetPassword from '../auth/ForgetPassword';

import Register from '../auth/Register';
import Alert from '../layout/Alert';

import Dashboard from '../dashboard/Dashboard';
import UploadImage from '../dashboard/UploadImages';

import CreateProfile from '../profile-form/CreateProfile';
import EditProfile from '../profile-form/EditProfile';
import AddExperience from '../profile-form/AddExperience';
import AddEducation from '../profile-form/AddEducation';
import ChangePassword from '../profile-form/ChangePassword';

import Profiles from '../Profiles/Profiles';
import Profile from '../Profile/Profile';
import Message from '../messages/Message';
import Mailbox from '../messages/Mailbox';

import Posts from '../posts/Posts';
import Post from '../post/Post';

import NotFound from '../layout/NotFound';
import PrivateRoute from '../routing/PrivateRoute';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Routes = () => {
  return (
    <section className='container' style={{ paddingTop: '5px' }}>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/forgetpassword' component={ForgetPassword} />
        <Route exact path='/profiles' component={Profiles} />
        <Route exact path='/profile/:id' component={Profile} />

        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/upload-images' component={UploadImage} />

        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />
        <PrivateRoute exact path='/add-experience' component={AddExperience} />
        <PrivateRoute exact path='/add-education' component={AddEducation} />
        <PrivateRoute exact path='/changepassword' component={ChangePassword} />
        <PrivateRoute exact path='/message' component={Message} />
        <PrivateRoute exact path='/my-messages' component={Mailbox} />
        <PrivateRoute exact path='/posts' component={Posts} />
        <PrivateRoute exact path='/posts/:id' component={Post} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
};

export default Routes;
