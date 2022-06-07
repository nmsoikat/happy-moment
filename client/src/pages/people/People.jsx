import './people.css'
import Person from '../../components/person/Person';
import axios from 'axios'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import Rightbar from '../../components/rightbar/Rightbar';
import { Spinner, Stack } from 'react-bootstrap';

export default function Profile({ socket, onlineFriends, stopSpinner, isFriendsUpdated, updateCurrentUser }) {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState([])

  const fetchAllUsers = async (searchValue) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*',
      },
      withCredentials: true
    }

    const res = searchValue ? await axios.get(`${API_URL}/api/v1/users?searchUser=${searchValue}`, config) : await axios.get(`${API_URL}/api/v1/users`, config)

    setAllUsers(
      res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt)
      })
    )
  }


  useEffect(() => {
    fetchAllUsers();
  }, [])

  return (
    <>
      <Topbar socket={socket} fetchAllUsers={fetchAllUsers} />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar />
          </div>
          <div className="col-md-6">
            {
              allUsers.length > 0 ?
                allUsers.map(person => (
                  <Person key={person._id} person={person} />
                ))
                :
                (!stopSpinner && <Stack className="text-center my-3">
                  <Spinner className='mx-auto' animation="border" variant="primary" />
                </Stack>)
            }
          </div>
          <div className="col-md-3">
            <Rightbar stopSpinner={stopSpinner} onlineFriends={onlineFriends} {...{ isFriendsUpdated, updateCurrentUser }} />
          </div>
        </div>
      </div>
    </>
  );
}