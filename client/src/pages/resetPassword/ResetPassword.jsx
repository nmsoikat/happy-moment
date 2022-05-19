import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";
import axios from 'axios';
import {API_URL} from '../../Constant'

const initialValues = {
  password: "",
  confirmPass: "",
};

const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password can not be empty!").min(6, "Too short!"),
  confirmPass: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Password must match!"
  ),
});

export default function ResetPassword() {
  const { user, isFetching, error, dispatch, token } = useContext(AuthContext)
  let { token:resetToken } = useParams();
  const navigate = useNavigate()
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  }

  const onSubmit = async (values) => {
    await axios.patch(`${API_URL}/api/v1/auth/reset-password/${resetToken}`, { password: values.password }, config)
    navigate('/login')
  }


  return <>
    <div className="login">
      <div className="login-wrapper">
        <div className="login-left">
          <h3 className="login-logo">Reset Password</h3>
          <div className="span login-desc">
            Please provide your new password <br />
            and confirm the password
          </div>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}>
          {({ errors, touched, isValidating }) => (
            <Form className="login-right">
              <div className="login-box">
                <h1 className="display-5 text-center">Reset Password</h1>

                <div className="mb-2 mt-4">
                  <Field
                    type="password"
                    name="password"
                    className={`form-control ${(errors.password && touched.password) && 'is-invalid'}`}
                    placeholder="New Password"
                  />
                  <ErrorMessage
                    name="password"
                    className="text-danger"
                    component={TextError}
                  />
                </div>

                <div className="mb-2">
                  <Field
                    type="password"
                    name="confirmPass"
                    className={`form-control ${(errors.confirmPass && touched.confirmPass) && 'is-invalid'}`}
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPass"
                    className="text-danger"
                    component={TextError}
                  />
                </div>

                <button className='login-btn w-100 mt-4' type='submit' disabled={isFetching}>
                  {isFetching ? <CircularProgress color="inherit" size="20px" /> : "Submit"}
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
