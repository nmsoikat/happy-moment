import './register.css';
import { useRef } from 'react';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {

  const username = useRef()
  const email = useRef()
  const password = useRef()
  const confirmPassword = useRef()

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password.current.value !== confirmPassword.current.value) {
      confirmPassword.current.setCustomValidity('Confirm password dose not match!');
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }
      try {
        await axios.post('/auth/register', user)
        navigate('/login')
      } catch (error) {
        console.log(error);
      }
    }
  }


  return <>
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Social APP</h3>
          <div className="span login-desc">
            Connect with friends and the world around you on Social APP.
          </div>
        </div>
        <form className="login-right" onSubmit={submitHandler}>
          <div className="login-box">
            <h2 className="register-title">Create a New Account</h2>
            <input placeholder="Username" ref={username} className="login-input" required />
            <input placeholder="Email" ref={email} className="login-input" required />
            <input placeholder="Password" type="password" minLength="6" ref={password} className="login-input" required />
            <input placeholder="Password Confirm" type="password" ref={confirmPassword} className="login-input" required />
            <button className='login-btn' type='submit'>Sign Up</button>
            <button className='register-btn'><Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>Log Into Account</Link></button>
          </div>
        </form>
      </div>
    </div>
  </>;
}
