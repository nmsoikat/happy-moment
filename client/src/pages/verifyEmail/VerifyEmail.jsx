import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";
import axios from 'axios';
import { API_URL } from '../../Constant'
import { toast } from 'react-toastify';
import { Spinner, Stack } from 'react-bootstrap';

export default function VerifyEmail({ newMail }) {
  const [isMailVerified, setIsmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  let { token: resetToken } = useParams();
  const { user: currentUser } = useContext(AuthContext);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }


  useEffect(() => {
    const VerifyEmail = async () => {
      setIsLoading(true);
      console.log(newMail);
      const { data } = !newMail ? await axios.patch(`${API_URL}/api/v1/auth/email-verification-complete/${resetToken}`, {}, config) :
        await axios.patch(`${API_URL}/api/v1/auth/email-verification-complete/new/${resetToken}`, {}, config)
      if (data.success) {
        toast.success(data.message)
        setIsmailVerified(true)
        setTimeout(() => {
          if (!newMail) {
            navigate('/login')
          } else {
            navigate(`/profile/${currentUser.username}`)
          }
        }, 3000)
      } else {
        toast.error(data.message)
      }

      setIsLoading(false);
    }

    VerifyEmail()
  }, [newMail])

  return <>
    <div className="login">
      {
        isMailVerified ? (
          <div className="login-wrapper">
            <div className="login-left text-center">
              <h3 className="login-logo text-success mb-5">Successfully Verified</h3>

              <h4>Email verification complete</h4>
              <div className="span login-desc">
                Click login button or within 3s we will redirect to login page <br />
                <b>Thank you!</b>
              </div>

              <div className='text-center mt-3'><Link to="/login" className="btn btn-success">Login</Link></div>
            </div>
          </div>
        ) : (
          <div className="login-wrapper">
            <div className="login-left">
              {
                isLoading && <Stack className="text-center my-3">
                  <Spinner className='mx-auto' animation="border" variant="primary" />
                  <p>Verification in progress...</p>
                  <p>Please Wait!</p>
                </Stack>
              }
              <div className='text-center'>
                <Link to="/register" className="btn btn-info">Home</Link>
              </div>
            </div>
          </div>
        )
      }
    </div>
  </>
}
