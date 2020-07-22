import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPostsUser } from '../../action/post';
import { addLike, removeLike, deletePost } from '../../action/post';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { post } from 'request';

const DashboardPost = ({
  getPostsUser,
  auth,
  addLike,
  removeLike,
  deletePost,
  post: { posts, loading },
  showActions,
}) => {
  useEffect(() => {
    getPostsUser();
  }, [getPostsUser]);

  const myposts = posts.map((post) => (
    <div key={post._id} class='post bg-white p-1 my-1'>
      <div>
        <img class='round-img' src={post.avatar} alt='' />
        <h4>{post.name}</h4>
      </div>
      <div class='wrap-post'>
        <p class='my-1 wrap-post'>{post.text}</p>
        <p class='post-date'>
          Posted on <Moment format='DD/MM/YYYY'>{post.date}</Moment>
        </p>
        {showActions && (
          <Fragment>
            <button
              onClick={(e) => addLike(post._id)}
              type='button'
              class='btn btn-light'
            >
              <i class='fas fa-thumbs-up'></i>{' '}
              <span>
                {post.likes.length > 0 && <span>{post.likes.length}</span>}
              </span>
            </button>
            <button
              onClick={(e) => removeLike(post._id)}
              type='button'
              class='btn btn-light'
            >
              <i class='fas fa-thumbs-down'></i>
            </button>
            <Link to={`/posts/${post._id}`} class='btn btn-primary'>
              Comment{' '}
              {post.comments.length > 0 && (
                <span class='comment-count'>{post.comments.length}</span>
              )}
            </Link>
            {!auth.loading && post.user === auth.user._id && (
              <button
                onClick={(e) => deletePost(post._id)}
                type='button'
                class='btn btn-danger'
              >
                <i class='fas fa-times'></i>
              </button>
            )}
          </Fragment>
        )}
      </div>
    </div>
  ));
  return (
    <Fragment>
      {posts.length > 0 ? (
        <div className='posts bg-light' style={{ padding: '10px' }}>
          <h2 className='my-2' style={{ textAlign: 'center' }}>
            Posts
          </h2>
          {myposts}
        </div>
      ) : (
        <div
          className='posts bg-light'
          style={{ padding: '10px', textAlign: 'center' }}
        >
          <h2 className='my-2'>No recent Posts</h2>
        </div>
      )}
    </Fragment>
  );
};

DashboardPost.defaultProps = {
  showActions: true,
};

DashboardPost.propTypes = {
  getPostsUser: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  post: state.post,
});

export default connect(mapStateToProps, {
  getPostsUser,
  addLike,
  removeLike,
  deletePost,
})(DashboardPost);
