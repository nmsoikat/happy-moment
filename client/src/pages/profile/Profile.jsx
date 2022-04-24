import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import About from '../../components/about/About'
import AllFriends from '../../components/allFriends/AllFriends'
import AllFriendsRequest from '../../components/allFriendsRequest/AllFriendsRequest'
import AllFriendsSentRequest from '../../components/allFriendsSentRequest/AllFriendsSentRequest'
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams()
  const [user, setUser] = useState({})
  const { user: currentUser, token } = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState([]);
  const [friendsRequestList, setFriendsRequestList] = useState([]);
  const [friendsSentRequestList, setFriendsSentRequestList] = useState([]);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  // user profile by username
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios(`/users/single?username=${username}`);
      setUser(res.data)
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
        const { data } = await axios.get(`/users/friends/${currentUser?._id}`, config)
        setFriendsList(data)
      }
    } catch (err) {
      console.log(err);
    }
  }
  const unfriendHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`/users/friends/${targetUserId}/unfriend`, {}, config)
      if (data.status === "success") {
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
        const { data } = await axios.get(`/users/friends/view-friend-request/${user?._id}`, config)
        setFriendsRequestList(data)
      }
    } catch (err) {
      console.log(err);
    }
  }
  const confirmRequestHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`/users/friends/${targetUserId}/confirm-request`, {}, config)
      if (data.status === "success") {
        gerFriendsRequest();
      }

    } catch (err) {
      console.log(err);
    }
  }
  const deleteRequestHandler = async (e) => {
    const targetUserId = e.target.value;
    try {
      const { data } = await axios.put(`/users/friends/${targetUserId}/delete-request`, {}, config)
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
        const { data } = await axios.get(`/users/friends/view-sent-req/${currentUser?._id}`, config)
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
      const { data } = await axios.put(`/users/friends/${targetUserId}/cancel-request`, {}, config)
      if (data.status === "success") {
        // setLoading(false)
        // loading = false;
        gerFriendsSentRequest();
      }

    } catch (err) {
      console.log(err);
    }
  }


  return (
    <>
      <Topbar />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-9">

            <div className="profile-right-top">
              <div className="profile-cover">
                <img className='profile-cover-img' src={(user.coverPicture && PF + user.coverPicture) || PF + '/person/noCover.png'} alt="" />
                <img className='profile-user-img' src={(user.profilePicture && PF + user.profilePicture) || PF + 'person/noAvatar.png'} alt="" />
              </div>
              <div className="profile-info">
                <h4 className="profile-info-name">{user.firstName + " " + user.lastName}</h4>
                <p className="profile-info-desc">{user.desc}</p>
              </div>
            </div>

            <Tab.Container className="profile-tab-wrap" defaultActiveKey="post">
              <Row>
                <Col md={9}>
                  <Tab.Content className='tab-content-wrap'>
                    <Tab.Pane eventKey="post">
                      <Feed username={username} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="friends">
                      {
                        user.username === currentUser.username ?
                          <AllFriends friendsList={friendsList} unfriendHandler={unfriendHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="friendRequests">
                      {
                        user.username === currentUser.username ?
                          <AllFriendsRequest friendsRequestList={friendsRequestList} confirmRequestHandler={confirmRequestHandler} deleteRequestHandler={deleteRequestHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="sentRequests">
                      {
                        user.username === currentUser.username ?
                          <AllFriendsSentRequest friendsSentRequestList={friendsSentRequestList} cancelRequestHandler={cancelRequestHandler} />
                          : <div className='friend-list-hidden-text'>Friend List is hidden</div>
                      }
                    </Tab.Pane>
                    <Tab.Pane eventKey="about">
                      <About user={user} />
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
                <Col md={3}>
                  <Nav variant="pills" className="flex-column tab-control">
                    <Nav.Item>
                      <Nav.Link eventKey="post">Posts</Nav.Link>
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
    </>
  );
}
