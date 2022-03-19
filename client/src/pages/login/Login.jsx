import './login.css';
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const email = useRef()
  const password = useRef()

  const { user, isFetching, error, dispatch } = useContext(AuthContext)

  const loginHandler = (e) => {
    e.preventDefault();

    loginCall({
      email: email.current.value,
      password: password.current.value
    }, dispatch)
  }


  return (<>
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Social APP</h3>
          <div className="span login-desc">
            Connect with friends and the world around you on Social APP.
          </div>
        </div>
        <div className="login-right">
          <form className="login-box" onSubmit={loginHandler}>
            <input
              placeholder="Email"
              className="login-input"
              type="email"
              required
              ref={email} />

            <input
              placeholder="Password"
              className="login-input"
              type="password"
              minLength="6"
              required
              ref={password} />

            <button className='login-btn' type='submit' disabled={isFetching}>
              {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Log In"}
            </button>

            <span className="password-forgot">Forgot Password?</span>
            <button className='register-btn'>
              {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Create a New Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </>);
}
