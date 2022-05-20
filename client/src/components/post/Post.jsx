import './post.css'
import { MoreVert } from '@mui/icons-material';
import { useContext, useEffect, useState, forwardRef, useRef } from 'react';
import axios from 'axios';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import Comment from '../comment/Comment'

const Post = forwardRef(({ post, myRef }) => {

  const [like, setLike] = useState(post.likes.length)
  const [isLike, setIsLike] = useState(false)
  const [user, setUser] = useState({})

  const [commentBody, setCommentBody] = useState('')
  const [commentReplyBody, setCommentReplyBody] = useState('')

  const [newComments, setNewComments] = useState([])
  const [newReplyComments, setNewReplyComments] = useState([])

  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const [isReplyBoxVisible, setIsReplyBoxVisible] = useState(false)

  const PF = REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser, token } = useContext(AuthContext)

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  useEffect(() => {
    setIsLike(post.likes.includes(currentUser._id))
  }, [post.likes, currentUser._id])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${API_URL}/api/v1/users/single?id=${post.userId}`, config)
      setUser(res.data)
    }
    fetchUser();
  }, [post.userId])

  const likeHandler = async () => {
    try {
      await axios.put(`${API_URL}/api/v1/posts/${post._id}/like`, { userId: currentUser._id }, config)
      setLike(isLike ? like - 1 : like + 1)
      setIsLike(!isLike);
    } catch (err) {
      console.log(err);
    }
  }

  //Comment Handler
  const commentOnKeyUp = async (event, postId) => {
    setCommentBody(event.target.value)

    if (event.key === 'Enter') {
      if (!commentBody) return;

      const newComment = await axios.post(`${API_URL}/api/v1/comments/create-comment/${postId}`, { data: commentBody }, config)

      setNewComments(prev => [newComment.data, ...prev])
      setIsCommentVisible(true)

      event.target.value = '';
    }
  }

  //Reply Handler
  const commentReplyOnKeyUp = async (event, postId) => {
    setCommentReplyBody(event.target.value)

    if (event.key === 'Enter') {
      if (!commentReplyBody) return;

      const newCommentReply = await axios.post(`${API_URL}/api/v1/comments/create-reply/${postId}`, { data: commentReplyBody }, config)

      setNewReplyComments(prev => [...prev, newCommentReply.data])

      event.target.value = '';
      setIsCommentVisible(true)
      setIsReplyBoxVisible(false)
    }
  }

  return <div ref={myRef} className='post shadow-sm bg-white'>
    <div className="post-wrapper">
      <div className="post-top">
        <div className="post-top-left">
          <Link to={`/profile/${user.username}`}>
            <img className='post-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
          </Link>
          <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: '#222', display: 'inline-block' }}><span className="post-username">{user.firstName + ' ' + user.lastName}</span></Link>
          <span className="post-date">{moment(post.createdAt).fromNow()}</span>
        </div>
        <div className="post-top-right">
          <MoreVert className='post-option-icon' />
        </div>
      </div>

      <div className="post-center">
        <span className="post-text">{post?.desc}</span>
        {post?.photo ? (
          <img className='post-img' src={PF + 'post/' + post?.photo} alt="" />
        ) : (''
          // <video src={'/assets/The-Breathtaking-Beauty-of-Nature-HD.mp4'} controls>
          //   Your browser does not support the video tag.
          // </video>
        )}

      </div>

      <div className="post-bottom">
        <div className="post-bottom-left">
          <img className='post-like-icon' src={`${PF}like.png`} alt="like" onClick={likeHandler} />
          {/* <img className='post-like-icon' src={`${PF}heart.png`} alt="heart" onClick={likeHandler} /> */}
          <span className="post-like-count">{like} people smile it</span>
        </div>
        <div className="post-bottom-right">
          <span className="post-comment-text" onClick={() => setIsCommentVisible(!isCommentVisible)}>{post.comments?.length + newComments.length} comments</span>
        </div>
      </div>

      <div className="comments-wrap shadow-sm p-2 mt-3 bg-body rounded">
        {
          isCommentVisible &&
          newComments.map(comment => (
            <div key={comment._id} className="comment-row">
              <div className="comment-card">
                <img className='post-profile-img current-user-profile-img' src={(comment.userId.profilePicture && PF + comment.userId.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                <div className="comment-body">
                  <div className='comment'>
                    <b>{comment.userId.firstName}</b>
                    <p>{comment.body}</p>
                  </div>
                </div>
              </div>
              {
                newReplyComments.length > 0 &&
                newReplyComments.map((replyComment, index) => (
                  <div key={index} className="comment-card reply">
                    <img className='post-profile-img current-user-profile-img' src={(replyComment.profilePicture && PF + replyComment.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                    <div className="comment-body">
                      <div className='comment'>
                        <b>{replyComment.firstName}</b>
                        <p>{replyComment.body}</p>
                      </div>
                    </div>

                  </div>
                ))
              }
              <div className="toggle-reply-input" onClick={() => setIsReplyBoxVisible(!isReplyBoxVisible)}>Reply</div>
              <div className={`reply-input-box ${isReplyBoxVisible ? '' : 'visually-hidden'}`}>
                <img className='post-profile-img current-user-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                <input onKeyUp={(event) => commentReplyOnKeyUp(event, comment._id)} type="text" className="form-control rounded-pill" placeholder="Press Enter to Reply" name="reply" />
              </div>
            </div>
          ))
        }
        {
          isCommentVisible &&
          post.comments.reverse().map(comment => (
            <div key={comment._id} className="comment-row">
              <div className="comment-card">
                <img className='post-profile-img current-user-profile-img' src={(comment.userId.profilePicture && PF + comment.userId.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                <div className="comment-body">
                  <div className='comment'>
                    <b>{comment.userId.firstName}</b>
                    <p>{comment.body}</p>
                  </div>
                </div>
              </div>
              {
                comment.replies.length > 0 &&
                comment.replies.map(commentReply => (
                  <div key={commentReply._id} className="comment-card reply">
                    <img className='post-profile-img current-user-profile-img' src={(commentReply.userId.profilePicture && PF + commentReply.userId.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                    <div className="comment-body">
                      <div className='comment'>
                        <b>{commentReply.userId.firstName}</b>
                        <p>{commentReply.body}</p>
                      </div>

                    </div>
                  </div>
                ))
              }

              <div className="toggle-reply-input" onClick={() => setIsReplyBoxVisible(!isReplyBoxVisible)}>Reply</div>
              <div className={`reply-input-box ${isReplyBoxVisible ? '' : 'visually-hidden'}`}>
                <img className='post-profile-img current-user-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                <input onKeyUp={(event) => commentReplyOnKeyUp(event, comment._id)} type="text" className="form-control rounded-pill" placeholder="Press Enter to Reply" name="reply" />
              </div>
            </div>
          ))
        }


        <div className="comment-input-box">
          <img className='post-profile-img current-user-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
          <input type="text" onKeyUp={(event) => commentOnKeyUp(event, post._id)} className="form-control rounded-pill" placeholder="Press enter to submit" />
        </div>
      </div>
    </div>
  </div>;
})

export default Post