import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";
import axios from 'axios';
import {API_URL} from '../../Constant'

const initialValues = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().required("Email can not be empty!").email("Invalid email format!"),
});

export default function ForgotPassword() {
  const { user, isFetching, error, dispatch, token } = useContext(AuthContext)
  const [isMailSent, setIsMailSent] = useState(false);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const onSubmit = async (values) => {
    await axios.post(`${API_URL}/auth/forgot-password`, { email: values.email }, config)
    setIsMailSent(true)
  }


  return <>
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Forgot Password?</h3>
          <div className="span login-desc">
            Please provide your valid email. <br />
            We will send all information to your mail for reset your password.
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, isValidating }) => (
            <Form className="login-right">
              <div className="login-box">
                <h1 className="display-5 text-center">Please Provide Your Email</h1>

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

                <button className='login-btn w-100 mt-4' type='submit' disabled={isFetching}>
                  {isFetching ? <CircularProgress color="inherit" size="20px" /> : !isMailSent ? "Send Reset Link": "Please Check Your Mail"}
                </button>
                <Link to="/login"><span className="password-forgot">Cancel</span></Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </>
}
