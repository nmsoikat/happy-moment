import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import { Button, Col, Modal, Nav, Row, Spinner, Tab } from 'react-bootstrap'
import About from '../../components/about/About'
import AllFriends from '../../components/allFriends/AllFriends'
import AllFriendsRequest from '../../components/allFriendsRequest/AllFriendsRequest'
import AllFriendsSentRequest from '../../components/allFriendsSentRequest/AllFriendsSentRequest'
import { AuthContext } from '../../context/AuthContext';
import CropEasy from '../../components/crop/CropEasy'
import { DialogContent, DialogContentText, TextField } from '@mui/material'
import { Box } from '@mui/system'
import EditIcon from '@mui/icons-material/Edit';
import { getUpdatedUser } from '../../apiCalls'

export default function Profile({ socket, setIsFriendsUpdated }) {
  const navigation = useNavigate();

  const PF = REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams()
  const [user, setUser] = useState({})
  const { user: currentUser, token, dispatch } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);
  const [friendsRequestList, setFriendsRequestList] = useState([]);
  const [friendsSentRequestList, setFriendsSentRequestList] = useState([]);


  const [file, setFile] = useState(null);
  const [photoURL, setPhotoURL] = useState(PF + (currentUser.profilePicture && 'person/' + currentUser.profilePicture || 'person/noAvatar.png'));
  const [photoCoverURL, setPhotoCoverURL] = useState(PF + (currentUser.coverPicture && 'personCover/' + currentUser.coverPicture || 'person/noCover.png'));
  const [openCrop, setOpenCrop] = useState(false);

  const [show, setShow] = useState(false);
  const [isCover, setIsCover] = useState(false);

  const handleShow = () => setShow(true);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  const handleChange = (e, cover = false) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (cover) {
        setPhotoCoverURL(URL.createObjectURL(file));
      } else {
        setPhotoURL(URL.createObjectURL(file));
      }
      setOpenCrop(true);
      handleShow()

      setIsCover(cover)
    }
  };

  const handleSubmit = async () => {
    try {
      if (file) {
        const data = new FormData()
        let removeSpaceFileName = file.name.toLocaleLowerCase().split(" ").join("-");
        const fileName = user._id + '_' + Date.now() + '_' + removeSpaceFileName;

        // store like array in array;
        data.append("file", file)
        // data.append("name", fileName)
        // data.profilePicture = fileName
        // data.userId = currentUser._id

        if (isCover) {
          await axios.put(`${API_URL}/api/v1/users/profile-cover/${currentUser._id}`, data, config)
        } else {
          await axios.put(`${API_URL}/api/v1/users/profile-pic/${currentUser._id}`, data, config)
        }

        // currentUser.profilePicture = updatedData.profilePicture;

        // localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }

    } catch (error) {
      console.log(error);
    }

  };

  // user profile by username
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios(`${API_URL}/api/v1/users/single?username=${username}`);
      setUser(data)
      setPhotoCoverURL(PF + (data.coverPicture && 'personCover/' + data.coverPicture || 'person/noCover.png'))
      setPhotoURL(PF + (data.profilePicture && 'person/' + data.profilePicture || 'person/noAvatar.png'))
    }

    fetchUser();
  }, [username])

  // ------------------------ Friends -----------------------
  const gerFriends = async () => {
    if (user.username !== currentUser.username) {
      return;
    }

    try {
      if (currentUser?._id) {
        const { data } = await axios.get(`${API_URL}/api/v1/users/friends/${currentUser?._id}`, config)
        setFriendsList(data)
      }
    } catch (err) {
      console.log(err);
    }
  }
  const unfriendHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/users/friends/${targetUserId}/unfriend`, {}, config)
      if (data.status === "success") {
        setIsFriendsUpdated(true)
        gerFriends();
      }
    } catch (err) {
      console.log(err);
    }
  }


  // ----------------------- Friend Request Handle --------------
  const gerFriendsRequest = async () => {
    if (user.username !== currentUser.username) {
      return;
    }
    try {
      if (user?._id) {
        const { data } = await axios.get(`${API_URL}/api/v1/users/friends/view-friend-request/${user?._id}`, config)
        setFriendsRequestList(data)
      }
    } catch (err) {
      console.log(err);
    }
  }
  const confirmRequestHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/users/friends/${targetUserId}/confirm-request`, {}, config)
      if (data.status === "success") {
        setIsFriendsUpdated(true)
        gerFriendsRequest();
      }

    } catch (err) {
      console.log(err);
    }
  }
  const deleteRequestHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/users/friends/${targetUserId}/delete-request`, {}, config)
      if (data.status === "success") {
        gerFriendsRequest();
      }

    } catch (err) {
      console.log(err);
    }
  }

  // ---------------------- Friend Sent Request Handle ---------------
  // Get User sent friend request list
  const gerFriendsSentRequest = async () => {
    if (user.username !== currentUser.username) {
      return;
    }

    try {
      if (currentUser?._id) {
        const { data } = await axios.get(`${API_URL}/api/v1/users/friends/view-sent-req/${currentUser?._id}`, config)
        setFriendsSentRequestList(data)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const cancelRequestHandler = async (e) => {
    // setLoading(true)
    // loading = true;
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`${API_URL}/api/v1/users/friends/${targetUserId}/cancel-request`, {}, config)
      if (data.status === "success") {
        // setLoading(false)
        // loading = false;
        gerFriendsSentRequest();
      }

    } catch (err) {
      console.log(err);
    }
  }

  //Re render the feed for friend profile view
  const [loadFeed, setLoadFeed] = useState()
  useEffect(() => {
    setLoadFeed(false)
    setTimeout(() => {
      setLoadFeed(true)
    }, 100)
  }, [user.username])

  const feedRerender = () => {
    setLoadFeed(false)
    setTimeout(() => {
      setLoadFeed(true)
    }, 100)
  }

  return (
    <>
      <Topbar socket={socket} />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">
            <div className="profile-right-top">
              <div className="profile-cover">
                <label htmlFor="profileCover">
                  {currentUser.username === user.username &&
                    <input
                      accept="image/*"
                      id="profileCover"
                      type="file"
                      name="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleChange(e, true)}
                    />
                  }
                  <img className='profile-cover-img  shadow-sm bg-white' src={(photoCoverURL && photoCoverURL) || PF + 'person/noCover.png'} alt="" />
                  {/* <img className='profile-user-img' src={PF + 'person/' + user.profilePicture} alt="" /> */}
                </label>

                {/* <div className='profile-user-img-wrap'>
                  <Button className="btn btn-sm" onClick={handleShow}>
                    <EditIcon />
                  </Button>
                  <img className='profile-user-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
                </div> */}
                <div className='profile-user-img-wrap'>
                  <label htmlFor="profilePhoto">
                    {currentUser.username === user.username &&
                      <input
                        accept="image/*"
                        id="profilePhoto"
                        type="file"
                        name="file"
                        style={{ display: 'none' }}
                        onChange={handleChange}
                      />
                    }
                    <img className='profile-user-img shadow-sm bg-white' src={(photoURL && photoURL) || PF + 'person/noAvatar.png'} alt="" />
                    {/* <img className='profile-user-img' src={PF + 'person/' + user.profilePicture} alt="" /> */}
                  </label>
                </div>
              </div>
              <div className="profile-info">
                <h4 className="profile-info-name">{user ? user.firstName + " " + user.lastName : '...'}</h4>
                <p className="profile-info-desc">{user ? user.desc : '...'}</p>
              </div>
            </div>

            <Tab.Container className="profile-tab-wrap" defaultActiveKey="post">
              <Row>
                <Col md={9}>
                  <Tab.Content className='tab-content-wrap'>
                    <Tab.Pane eventKey="post">
                      {loadFeed && <Feed username={username} profile={true} isCurrentUser={user.username === currentUser.username} />}
                    </Tab.Pane>
                    <Tab.Pane eventKey="friends" className="tab-pane-wrap" >
                      {
                        user.username === currentUser.username ?
                          <AllFriends friendsList={friendsList} unfriendHandler={unfriendHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="friendRequests" className="tab-pane-wrap" >
                      {
                        user.username === currentUser.username ?
                          <AllFriendsRequest friendsRequestList={friendsRequestList} confirmRequestHandler={confirmRequestHandler} deleteRequestHandler={deleteRequestHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="sentRequests" className="tab-pane-wrap" >
                      {
                        user.username === currentUser.username ?
                          <AllFriendsSentRequest friendsSentRequestList={friendsSentRequestList} cancelRequestHandler={cancelRequestHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="about" className="tab-pane-wrap" >
                      <About user={user} isCurrentUser={user.username === currentUser.username} />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
                <Col md={3}>
                  <Nav variant="pills" className="flex-column tab-control bg-white shadow-sm">
                    <Nav.Item>
                      <Nav.Link onClick={feedRerender} eventKey="post">Posts</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={gerFriends} eventKey="friends">Friends</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={gerFriendsRequest} eventKey="friendRequests">Friend Requests</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link onClick={gerFriendsSentRequest} eventKey="sentRequests">Sent Requests</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="about">About</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
              </Row>
            </Tab.Container>
          </div>
        </div>
      </div>

      {openCrop && <CropEasy {...{ isCover, photoCoverURL, setPhotoCoverURL, handleSubmit, photoURL, setPhotoURL, setFile, setOpenCrop, show }} />}
    </>
  );
}
