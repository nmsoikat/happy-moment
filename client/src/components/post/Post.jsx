import './post.css'
import { MoreVert } from '@mui/icons-material';
import { useContext, useEffect, useState, forwardRef } from 'react';
import axios from 'axios';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'

const Post = forwardRef(({ post, myRef, socket }) => {
  const [like, setLike] = useState(post.likes.length)
  const [isLike, setIsLike] = useState(false)
  const [isLikeClick, setIsLikeClick] = useState(false)
  const [isAnyComment, setIsAnyComment] = useState(false)
  const [user, setUser] = useState({})

  const [deletedPost, setDeletedPost] = useState({ postId: post._id, deleted: false });

  const [comments, setComments] = useState(post.comments)
  const [postType, setPostType] = useState({ postType: post.postType, postId: post._id })
  const [newReply, setNewReply] = useState({})

  const [isCommentVisible, setIsCommentVisible] = useState(false)
  const [isReplyInputBoxVisible, setIsReplyInputBoxVisible] = useState({ visible: false, commentId: '' })
  const [isPostTypeVisible, setIsPostTypeVisible] = useState({ visible: false, postId: '' })

  const PF = REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser, token } = useContext(AuthContext)

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // Reply
  useEffect(() => {
    if (Object.keys(newReply).length > 0) {
      const updatedComments = comments.map(comment => {
        if (comment._id === newReply.commentId) {
          comment.replies.push(newReply.reply.data)
        }
        return comment
      })

      setComments(updatedComments)
    }
  }, [newReply])

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

      setIsLikeClick(true) //for notification
    } catch (err) {
      console.log(err);
    }
  }

  // set notification for like
  useEffect(() => {
    if (isLikeClick) {
      if (isLike) {
        socket?.emit("sendNotification", {
          senderId: currentUser._id,
          receiverId: post.userId,
          postId: post._id,
          senderName: currentUser.firstName + ' '+ currentUser.lastName,
          type: 'like',
        })
      }
      console.log('like');

      setIsLikeClick(false)
    }
  }, [isLikeClick])

  // set notification for comment
  useEffect(() => {
    if (isAnyComment) {
      socket?.emit("sendNotification", {
        senderId: currentUser._id,
        receiverId: post.userId,
        postId: post._id,
        senderName: currentUser.firstName + ' '+ currentUser.lastName,
        type: 'comment',
      })

      setIsAnyComment(false)
    }
  }, [isAnyComment])

  //Comment Handler
  const commentOnKeyUp = async (event, postId) => {
    const commentBody = event.target.value;

    if (event.key === 'Enter') {
      if (!commentBody) return;

      const createdComment = await axios.post(`${API_URL}/api/v1/comments/create-comment/${postId}`, { data: commentBody }, config)

      setComments(prev => [...prev, createdComment.data])

      // setNewComment({postId, createdComment})

      setIsCommentVisible(true) //comment area visible
      event.target.value = '';

      setIsAnyComment(true) //for notification
    }
  }

  //Reply Handler
  const commentReplyOnKeyUp = async (event, commentId) => {

    const commentReplyBody = event.target.value;

    if (event.key === 'Enter') {
      if (!commentReplyBody) return;

      const reply = await axios.post(`${API_URL}/api/v1/comments/create-reply/${commentId}`, { data: commentReplyBody }, config)
      setNewReply({ commentId, reply })

      event.target.value = '';
      setIsCommentVisible(true) //comment area visible
      setIsReplyInputBoxVisible({ visible: false, commentId: '' }) //replay input box hide

      setIsAnyComment(true) //for notification
    }
  }

  const replyInputBoxToggler = (commentId) => {
    // console.log(isReplyInputBoxVisible.commentId, commentId);
    if (!isReplyInputBoxVisible.commentId) {
      setIsReplyInputBoxVisible({ visible: true, commentId })
    } else if (isReplyInputBoxVisible.commentId === commentId) {
      setIsReplyInputBoxVisible({ visible: !isReplyInputBoxVisible.visible, commentId })
    } else {
      setIsReplyInputBoxVisible({ visible: true, commentId })
    }
  }

  const togglePostTypeHandler = (postId) => {
    if (!isPostTypeVisible.postId) {
      setIsPostTypeVisible({ visible: true, postId })
    } else if (isPostTypeVisible.postId === postId) {
      setIsPostTypeVisible({ visible: !isPostTypeVisible.visible, postId })
    } else {
      setIsPostTypeVisible({ visible: true, postId })
    }
  }

  const updatePostType = async (postType) => {
    await axios.patch(`${API_URL}/api/v1/posts/type/${postType.postId}`, { postType: postType.postType, userId: currentUser._id }, config)

    setPostType(postType)
    setIsPostTypeVisible({ visible: false, postId: '' })
  }

  const deleteUserPostById = async (postId) => {
    await axios.delete(`${API_URL}/api/v1/posts/${postId}`, config)
    setIsPostTypeVisible({ visible: false, postId: '' })
    setDeletedPost({ postId, deleted: true })
  }

  return <div ref={myRef} className={`post shadow-sm bg-white ${(deletedPost.postId === post._id && deletedPost.deleted) && 'd-none'}`}>
    <div className="post-wrapper">
      <div className="post-top">
        <div className="post-top-left">
          <Link to={`/profile/${user.username}`}>
            <img className='post-profile-img' src={(user.profilePicture && PF + 'person/' + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
          </Link>
          <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: '#222', display: 'inline-block' }}><span className="post-username">{user.firstName + ' ' + user.lastName}</span></Link>
          <span className="post-date">{moment(post.createdAt).fromNow()}</span>
        </div>
        {
          currentUser._id === post.userId &&
          (
            <div className="post-top-right" onClick={() => togglePostTypeHandler(post._id)}>
              <MoreVert className='post-option-icon' />
              {
                (isPostTypeVisible.visible && isPostTypeVisible.postId === post._id) &&
                (
                  <div className='dropdown shadow'>
                    <label className={`d-block ${postType.postType === 'public' && 'selected'}`} onClick={() => updatePostType({ postType: 'public', postId: post._id })}>Public</label>
                    <label className={`d-block ${postType.postType === 'private' && 'selected'}`} onClick={() => updatePostType({ postType: 'private', postId: post._id })}>Private</label>
                    <label className={`d-block text-danger`} onClick={() => deleteUserPostById(post._id)}>Delete</label>
                  </div>

                )
              }
            </div>
          )
        }
      </div>

      <div className="post-center">
        <p className="post-text">{post?.desc}</p>
        {post?.photo && <img className='post-img' src={PF + 'post/' + post?.photo} alt="" />}
        {post?.video && (
          <video src={PF + 'post/' + post?.video} controls>
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="post-bottom">
        <div className="post-bottom-left">
          <img className='post-like-icon' src={`${PF}like.png`} alt="like" onClick={likeHandler} />
          {/* <img className='post-like-icon' src={`${PF}heart.png`} alt="heart" onClick={likeHandler} /> */}
          <span className="post-like-count">{like} people smile it</span>
        </div>
        <div className="post-bottom-right">
          <span className="post-comment-text" onClick={() => setIsCommentVisible(!isCommentVisible)}>{comments?.length} comments</span>
        </div>
      </div>

      <div className="comments-wrap shadow-sm p-2 mt-3 bg-body rounded">

        {
          isCommentVisible && comments.length > 0 ?
            comments.map(comment => (
              <div key={comment._id} className="comment-row">
                <div className="comment-card">
                  <img className='post-profile-img current-user-profile-img' src={(comment.userId.profilePicture && PF + 'person/' + comment.userId.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
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
                      <img className='post-profile-img current-user-profile-img' src={(commentReply.userId.profilePicture && PF + 'person/' + commentReply.userId.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                      <div className="comment-body">
                        <div className='comment'>
                          <b>{commentReply.userId.firstName}</b>
                          <p>{commentReply.body}</p>
                        </div>
                      </div>
                    </div>
                  ))
                }

                <div className="toggle-reply-input" onClick={(e) => replyInputBoxToggler(comment._id)}>Reply</div>
                {
                  (isReplyInputBoxVisible.visible && isReplyInputBoxVisible.commentId === comment._id) &&
                  (
                    <div className="reply-input-box">
                      <img className='post-profile-img current-user-profile-img' src={(currentUser.profilePicture && PF + 'person/' + currentUser.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                      <input onKeyUp={(event) => commentReplyOnKeyUp(event, comment._id)} type="text" className="form-control rounded-pill" placeholder="Press Enter to Reply" name="reply" />
                    </div>
                  )
                }
              </div>
            ))

            : ''
        }


        <div className="comment-input-box">
          <img className='post-profile-img current-user-profile-img' src={(currentUser.profilePicture && PF + 'person/' + currentUser.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
          <input type="text" onKeyUp={(event) => commentOnKeyUp(event, post._id)} className="form-control rounded-pill" placeholder="Press enter to submit" />
        </div>
      </div>
    </div>
  </div>;
})

export default Post