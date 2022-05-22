import './feed.css'
import '../share/share.css'
import axios from 'axios'
import Post from '../post/Post';
import { Cancel, PermMedia } from '@mui/icons-material';
import { Spinner, Stack } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import UseInfinityScroll from '../../UseInfinityScroll';
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { useState, useEffect, useContext, useRef, useCallback } from 'react';

const Feed = (props) => {
  const username = props.username;
  const profile = props.profile || false;
  const videoPage = props.videoPage || false;
  const trendingPage = props.trendingPage || false;

  //share post
  const PF = REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState('public');

  //feed
  const { user, token } = useContext(AuthContext)
  const [pageNumber, setPageNumber] = useState(1)
  const [query, setQuery] = useState('')
  const [newPosts, setNewPosts] = useState([])


  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  let url;
  if (profile) {
    url = `${API_URL}/api/v1/posts/profile/${username}/all`
  } else if (videoPage) {
    url = `${API_URL}/api/v1/posts/timeline-video/${user._id}/all`
  } else if (trendingPage) {
    url = `${API_URL}/api/v1/posts/timeline/tending`
  } else {
    url = `${API_URL}/api/v1/posts/timeline/${user._id}/all`
  }

  const params = { query, page: pageNumber }

  let { loading, error, docs, hasMore } = UseInfinityScroll(url, params, config)

  //set IntersectionObserver
  const observer = useRef();

  const lastDocElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect()

    // create IntersectionObserver
    observer.current = new IntersectionObserver((entires) => {
      // when element is visible callback will invoked
      if (entires[0].isIntersecting && hasMore) {
        setPageNumber(prev => prev + 1)
      }
    })

    //OBSERVE the element
    if (node) observer.current.observe(node)

  }, [loading, hasMore])


  // share post
  const submitHandler = async (e) => {
    e.preventDefault()

    if (!file && !desc.current.value) {
      return alert("Please add description or image.")
    }

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
      postType,
    }

    if (file) {
      const data = new FormData()
      let removeSpaceFileName = file.name.toLocaleLowerCase().split(" ").join("-");
      const fileName = user._id + '_' + Date.now() + '_' + removeSpaceFileName;

      // store like array in array;
      data.append("file", file)
      // data.append("name", fileName)

      newPost.photo = fileName;
      // console.log([...data]);
      // console.log(newPost);

      try {
        await axios.post(`${API_URL}/api/v1/upload/${fileName}`, data, config);
      } catch (err) {
        return console.log(err);
      }
    }

    try {
      const postShared = await axios.post(`${API_URL}/api/v1/posts`, newPost, config);

      setNewPosts(prev => [postShared.data, ...prev])

      desc.current.value = "";
      if (file) {
        cancelBlobView()
      }
    } catch (err) {
      console.log(err);
    }


  }

  // const setPostTypeHandler = (e) => {
  //   setPostType(e.target.value)
  // }

  const cancelBlobView = () => {
    setFile(null)
    URL.revokeObjectURL();
  }

  return <>
    <div className='feed'>
      <div className="feed-wrapper">
        {username ? username === user.username && (
          <div className='share shadow-sm bg-white'>
            <div className="share-wrapper">
              <div className="share-top">
                <img src={user.profilePicture ? PF + user.profilePicture : PF + "/person/noAvatar.png"} alt="" className="share-profile-img" />
                <input placeholder={"What's on your mind " + user.firstName + "?"} className="share-input" ref={desc} />
              </div>
              <hr className="share-hr" />
              {
                file && (
                  <div className="share-img-container">
                    {
                      (file.type === "video/mp4") ? (<div>
                        {file.name}
                        <Cancel className='share-img-cancel' onClick={() => cancelBlobView()} />
                      </div>) : (
                        <>
                          <img src={URL.createObjectURL(file)} alt="" className="share-img" />
                          <Cancel className='share-img-cancel' onClick={() => cancelBlobView()} />
                        </>
                      )
                    }
                  </div>
                )
              }

              <form className="share-bottom" encType="multipart/form-data" onSubmit={submitHandler}>
                <div className="share-options">
                  <label id="file" className="share-option">
                    <PermMedia htmlColor='tomato' className='share-option-icon' />
                    {/* <span className='share-option-text'>Photo or Video</span> */}
                    <span className='share-option-text'>Photo</span>
                    <input style={{ display: 'none' }} type="file" id="file" name='file' onChange={(e) => setFile(e.target.files[0])} />
                  </label>
                </div>
                <div className='post-setting'>
                  <select style={{ width: '100px', display: 'inline-block', marginRight: '5px' }} name="postType" onChange={(e) => setPostType(e.target.value)} className="form-select form-select-sm">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                  <button className="share-btn btn-sm" type='submit'>Share</button>
                </div>
              </form>
            </div>
          </div>
        ) : ''}
        {
          newPosts.map((p, index) => (
            <Post key={p._id} post={p} myRef={lastDocElementRef} />
          ))
        }
        {
          docs.map((p) => (
            <Post key={p._id} post={p} myRef={lastDocElementRef} />
          ))
        }
      </div>
    </div>

    {
      loading && (
        <Stack className="text-center my-3">
          <Spinner className='mx-auto' animation="border" variant="primary" />
        </Stack>

      )
    }

    {error && "Error"}
  </>;
}


export default Feed;