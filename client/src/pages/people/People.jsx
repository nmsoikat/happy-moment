import './people.css'
import Person from '../../components/person/Person';
import axios from 'axios'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import { REACT_APP_PUBLIC_FOLDER, API_URL } from '../../Constant'
import Rightbar from '../../components/rightbar/Rightbar';

export default function Profile() {
  const PF = REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, token } = useContext(AuthContext)
  const [allUsers, setAllUsers] = useState([])

  const fetchAllUsers = async (searchValue) => {

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }

    const res = searchValue ? await axios.get(`${API_URL}/users?searchUser=${searchValue}`, config) : await axios.get(`${API_URL}/users`, config)

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
      <Topbar fetchAllUsers={fetchAllUsers} />
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <Sidebar/>
          </div>
          <div className="col-md-6">
            {
              allUsers.map(person => (
                <Person key={person._id} person={person} />
              ))
            }
          </div>
          <div className="col-md-3">
            <Rightbar />
          </div>
        </div>
      </div>
    </>
  );
}