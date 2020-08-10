import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Mymessage from './Mymessage';

const Mailbox = (props) => {
  return (
    <Fragment>
      <div style={{}}>
        <div class='form-group row'>
          <div class='col'>People</div>
          <div class='col' style={{ flex: 'left' }}>
            Write Messages
          </div>
          <Link to='/message' class='btn btn-primary'>
            Reply
          </Link>
        </div>
      </div>
    </Fragment>
  );
};

Mailbox.propTypes = {};

export default Mailbox;
