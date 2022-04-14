import './profile.css'
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { REACT_APP_PUBLIC_FOLDER } from '../../Constant'
import { Col, Nav, Row, Tab } from 'react-bootstrap'
import About from '../../components/about/About'
import AllFriends from '../../components/allFriends/AllFriends'

export default function Profile() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { username } = useParams()

  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios(`/users/single?username=${username}`);
      setUser(res.data)
    }

    fetchUser();
  }, [username])

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
                <img className='profile-user-img' src={(user.profilePicture && PF + user.profilePicture) || PF + '/person/noAvatar.png'} alt="" />
              </div>
              <div className="profile-info">
                <h4 className="profile-info-name">{user.firstName + " "+ user.lastName}</h4>
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
                      <AllFriends user={user} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="friendRequests">
                      Friend Requests
                    </Tab.Pane>
                    <Tab.Pane eventKey="sentRequests">
                      Sent Requests
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
                      <Nav.Link eventKey="friends">Friends</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="friendRequests">Friend Requests</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="sentRequests">Sent Requests</Nav.Link>
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
