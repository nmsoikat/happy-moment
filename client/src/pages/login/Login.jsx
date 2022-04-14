import './login.css';
import { useContext, useRef } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";

const initialValues = {
  email: "",
  password: ""
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email can not be empty!").email("Invalid email format!"),
  password: Yup.string().required("Password can not be empty!").min(6, "Too short!"),
});

export default function Login() {
  const { user, isFetching, error, dispatch } = useContext(AuthContext)

  const onSubmit = (values) => {
    loginCall(
        {
          email: values.email,
          password: values.password
        }, dispatch
      )
  }


  return <>
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Happy Moment!</h3>
          <div className="span login-desc">
            Be happy for this moment :)
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, isValidating }) => (
            <Form className="login-right">
              <div className="login-box">
                <h1 className="display-5 text-center">Login</h1>

                <div className="mb-2 mt-4">
                  <Field
                    type="text"
                    name="email"
                    className={`form-control ${(errors.email && touched.email) && 'is-invalid'}`}
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    className="text-danger"
                    component={TextError}
                  />
                </div>

                <div className="mb-2">
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${(errors.password && touched.password) && 'is-invalid'}`}
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-danger"
                    component={TextError}
                  />
                </div>
        
                <button className='login-btn w-100 mt-4' type='submit' disabled={isFetching}>
                  {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Log In"}
                </button>

                {/* <span className="password-forgot">Forgot Password?</span> */}
                <button className='register-btn mx-auto d-block'>
                  <Link to="/register" style={{ textDecoration: 'none', color: 'white', display:'block' }}>
                    {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Create a New Account"}
                  </Link>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </>
}
