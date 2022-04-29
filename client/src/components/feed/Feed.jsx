import './feed.css'
import Share from '../share/Share'
import Post from '../post/Post';
import axios from 'axios'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {API_URL} from '../../Constant'

export default function Feed({ username }) {

  const [posts, setPosts] = useState([])
  const { user, token } = useContext(AuthContext)

  const fetchPosts = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }

    const res = username ?
      await axios.get(`/posts/profile/${username}`, config) :
      await axios.get(`/posts/timeline/${user._id}`, config)

    setPosts(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      })
    )
  }

  useEffect(() => {

    fetchPosts();
  }, [username, user._id])

  return <div className='feed'>
    <div className="feed-wrapper">
      {username ? username === user.username && <Share fetchPosts={fetchPosts} /> : ''}
      {
        posts.map(p => (
          <Post key={p._id} post={p} />
        ))
      }
    </div>
  </div>;
}
