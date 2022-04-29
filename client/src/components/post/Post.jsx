import './post.css'
import { MoreVert } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'

export default function Post({ post }) {

  const [like, setLike] = useState(post.likes.length)
  const [isLike, setIsLike] = useState(false)
  const [user, setUser] = useState({})

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
      const res = await axios.get(`/api/v1/users/single?id=${post.userId}`, config)
      setUser(res.data)
    }
    fetchUser();
  }, [post.userId])

  const likeHandler = async () => {
    try {
      await axios.put(`/api/v1/posts/${post._id}/like`, { userId: currentUser._id }, config)
      setLike(isLike ? like - 1 : like + 1)
      setIsLike(!isLike);
    } catch (err) {
      console.log(err);
    }
  }

  return <div className='post shadow-sm bg-white'>
    <div className="post-wrapper">
      <div className="post-top">
        <div className="post-top-left">
          <Link to={`/profile/${user.username}`}>
            <img className='post-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
          </Link>
          <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: '#222', display:'inline-block' }}><span className="post-username">{user.firstName + ' ' + user.lastName}</span></Link>
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
          <img className='post-like-icon' src={`${PF}/like.png`} alt="like" onClick={likeHandler} />
          <img className='post-like-icon' src={`${PF}/heart.png`} alt="heart" onClick={likeHandler} />
          <span className="post-like-count">{like} people smile it</span>
        </div>
        <div className="post-bottom-right">
          <span className="post-comment-text">{post.comment} comments</span>
        </div>
      </div>
    </div>
  </div>;
}
