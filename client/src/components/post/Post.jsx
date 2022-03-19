import './post.css'
import { MoreVert } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'timeago.js'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';

export default function Post({ post }) {

  const [like, setLike] = useState(post.likes.length)
  const [isLike, setIsLike] = useState(false)
  const [user, setUser] = useState({})

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user: currentUser } = useContext(AuthContext)

  useEffect(() => {
    setIsLike(post.likes.includes(currentUser._id))
  }, [post.likes, currentUser._id])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?id=${post.userId}`)
      setUser(res.data)
    }
    fetchUser();
  }, [post.userId])

  const likeHandler = async () => {
    try {
      await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id })
      setLike(isLike ? like - 1 : like + 1)
      setIsLike(!isLike);
    } catch (err) {
      console.log(err);
    }
  }

  return <div className='post'>
    <div className="post-wrapper">
      <div className="post-top">
        <div className="post-top-left">
          <Link to={`/profile/${user.username}`}>
            <img className='post-profile-img' src={(user.profilePicture && PF + user.profilePicture) || PF + '/person/noAvatar.png'} alt="" />
          </Link>
          <span className="post-username">{user.username}</span>
          <span className="post-date">{format(post.createdAt)}</span>
        </div>
        <div className="post-top-right">
          <MoreVert className='post-option-icon' />
        </div>
      </div>
      <div className="post-center">
        <span className="post-text">{post?.desc}</span>
        <img className='post-img' src={PF + post.photo} alt="" />
      </div>
      <div className="post-bottom">
        <div className="post-bottom-left">
          <img className='post-like-icon' src={`${PF}/like.png`} alt="like" onClick={likeHandler} />
          <img className='post-like-icon' src={`${PF}/heart.png`} alt="heart" onClick={likeHandler} />
          <span className="post-like-count">{like} people like it</span>
        </div>
        <div className="post-bottom-right">
          <span className="post-comment-text">{post.comment} comments</span>
        </div>
      </div>
    </div>
  </div>;
}
