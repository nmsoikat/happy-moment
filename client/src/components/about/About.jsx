import './about.css';
import React, { useContext, useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../../Constant';

const generalInfoInitialValues = {
  firstName: "",
  lastName: "",
  desc: "",
  livesIn: "",
  from: "",
};

const generalInfoValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name can not be empty!").min(2, "Too short!"),
  lastName: Yup.string().required("Last name can not be empty!").min(2, "Too short!"),
});


const changeEmailInitialValues = {
  email: "",
};
const changeEmailValidationSchema = Yup.object().shape({
  email: Yup.string().required("Email can not be empty!").email("Invalid email format!"),
});


const changePasswordInitialValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};
const changePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Password can not be empty!").min(6, "Too short!"),
  newPassword: Yup.string().required("Password can not be empty!").min(6, "Too short!"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword"), null],
    "Password must match!"
  ),
});


function About({ user, isCurrentUser, setFirstName: setProfileFirstName, setLastName: setProfileLastName, setDesc: setProfileDesc, setIsGeneralInfoUpdate }) {
  const [isLoading, setIsLoading] = useState()
  const [generalInfoToggle, setGeneralInfoToggle] = useState(false)
  const [changeEmailToggle, setChangeEmailToggle] = useState(false)
  const [changePassToggle, setChangePassToggle] = useState(false)

  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [desc, setDesc] = useState(user.desc)
  const [livesIn, setLivesIn] = useState(user.livesIn)
  const [from, setFrom] = useState(user.from)

  const [isMailSent, setIsMailSent] = useState(false);

  const [currentUser, setCurrentUser] = useState(useContext(AuthContext).user)
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true
  }

  useEffect(() => {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setDesc(user.desc)
    setLivesIn(user.livesIn)
    setFrom(user.from)
    generalInfoInitialValues.firstName = user.firstName
    generalInfoInitialValues.lastName = user.lastName
    generalInfoInitialValues.desc = user.desc || ''
    generalInfoInitialValues.livesIn = user.livesIn || ''
    generalInfoInitialValues.from = user.from || ''
  }, [user])



  const generalInfoSubmit = async (values) => {
    const info = {
      firstName: values.firstName,
      lastName: values.lastName,
      desc,
      livesIn,
      from
    }

    try {
      const { data } = await axios.patch(`${API_URL}/api/v1/users/${currentUser._id}`, info, config)
      if (data.success) {
        //profile state update
        setProfileFirstName(data.data.firstName)
        setProfileLastName(data.data.lastName)
        setProfileDesc(data.data.desc)
        setIsGeneralInfoUpdate(true)

        //about section update
        setFirstName(data.data.firstName)
        setLastName(data.data.lastName)

        setGeneralInfoToggle(false)
        toast.success("Information updated successfully")
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  const changeEmailSubmit = async (values) => {
    const info = {
      email: values.email,
      firstName: currentUser.firstName
    }

    const { data } = await axios.post(`${API_URL}/api/v1/auth/verify-email/new`, info, config)
    if (data.success) {
      toast.success(data.message)
      setIsMailSent(true)
    } else {
      toast.error(data.message)
    }
  }

  const changePasswordSubmit = async (values) => {
    const { data } = await axios.put(`${API_URL}/api/v1/users/change-password/${currentUser._id}`, values, config);
    if (data.success) {
      toast.success(data.message)
    } else {
      toast.error(data.message)
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between">
        <h4 className="profile-info-title">General Information</h4>
        {isCurrentUser && <div className="btn btn-sm btn-outline-secondary email-edit-btn" onClick={() => setGeneralInfoToggle(!generalInfoToggle)}>Edit</div>}
      </div>
      <div className="about-wrap">
        <Formik
          initialValues={generalInfoInitialValues}
          validationSchema={generalInfoValidationSchema}
          onSubmit={generalInfoSubmit}>
          {({ errors, touched, isValidating }) => (
            <Form>
              <div className="about-info-item">
                <span className="about-info-key">First Name:</span>
                {!generalInfoToggle && <span className="about-info-value">{firstName}</span>}
                {
                  generalInfoToggle && (
                    <div className='gi-field-wrap' >
                      <Field
                        type="text"
                        name="firstName"
                        className={`form-control ${(errors.firstName && touched.firstName) && 'is-invalid'}`}
                        placeholder="First Name"
                      // value={firstName}
                      // onChange={(e) => setFirstName(e.target.value)}
                      />
                      <ErrorMessage name="firstName" className="text-danger" component={TextError} />
                    </div>
                  )
                }
              </div>
              <div className="about-info-item">
                <span className="about-info-key">Last Name:</span>
                {!generalInfoToggle && <span className="about-info-value">{lastName}</span>}
                {
                  generalInfoToggle && (
                    <div className='gi-field-wrap' >
                      <Field
                        type="text"
                        name="lastName"
                        className={`form-control ${(errors.lastName && touched.lastName) && 'is-invalid'}`}
                        placeholder="Last Name"
                      // value={lastName}
                      // onChange={(e) => setLastName(e.target.value)}
                      />
                      <ErrorMessage name="lastName" className="text-danger" component={TextError}
                      />
                    </div>
                  )
                }
              </div>
              <div className="about-info-item">
                <span className="about-info-key">Bio:</span>
                {!generalInfoToggle && <span className="about-info-value">{desc}</span>}
                {
                  generalInfoToggle &&
                  (<div className='' >
                    <Field
                      type="text"
                      name="desc"
                      className={`form-control`}
                      placeholder="bio"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                    {/* <ErrorMessage name="desc" className="text-danger" component={TextError}
                    /> */}
                  </div>)
                }
              </div>
              <div className="about-info-item">
                <span className="about-info-key">Present Address:</span>
                {!generalInfoToggle && <span className="about-info-value">{livesIn}</span>}
                {
                  generalInfoToggle && (
                    <div className='' >
                      <Field
                        type="text"
                        name="livesIn"
                        className={`form-control`}
                        placeholder="Present Address"
                        value={livesIn}
                        onChange={(e) => setLivesIn(e.target.value)}
                      />
                      {/* <ErrorMessage name="livesIn" className="text-danger" component={TextError}
                      /> */}
                    </div>
                  )
                }
              </div>
              <div className="about-info-item">
                <span className="about-info-key">Permanent Address:</span>
                {!generalInfoToggle && <span className="about-info-value">{from}</span>}
                {
                  generalInfoToggle && (
                    <div className='' >
                      <Field
                        type="text"
                        name="from"
                        className={`form-control`}
                        placeholder="Permanent Address"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                      />
                      {/* <ErrorMessage name="from" className="text-danger" component={TextError}
                      /> */}
                    </div>
                  )
                }
              </div>
              {
                generalInfoToggle && (
                  <>
                    <button className={`btn btn-sm btn-outline-secondary`} disabled={isMailSent} type='reset' onClick={() => setGeneralInfoToggle(false)}>Cancel</button>
                    <button className='btn btn-sm btn-success' style={{ marginLeft: "10px" }} type='submit' disabled={isLoading}>
                      {isLoading ? <CircularProgress color="inherit" size="20px" /> : "Save Change"}
                    </button>
                  </>
                )
              }
            </Form>
          )}
        </Formik>

        {/* <div className="about-info-item">
          <span className="about-info-key">Username:</span>
          <span className="about-info-value">{user.username}</span>
        </div> */}
        {/* <div className="about-info-item">
        <span className="about-info-key">Relationship:</span>
        <span className="about-info-value">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "--"}</span>
      </div> */}
      </div>

      <h4 className="profile-info-title mt-4">Security &#38; Login</h4>
      <div className="about-wrap">
        <div className="about-info-item">
          <div className="change-email-wrap">
            <div className="change-email-label">
              <span className="about-info-key">Email:</span>
              <span className="about-info-value">{user.email}</span>
            </div>
            {isCurrentUser && <div className="btn btn-sm btn-outline-secondary" onClick={() => setChangeEmailToggle(!changeEmailToggle)}>Edit</div>}
          </div>
          {
            changeEmailToggle && (
              <div className="change-email-form">
                <Formik
                  initialValues={changeEmailInitialValues}
                  validationSchema={changeEmailValidationSchema}
                  onSubmit={changeEmailSubmit}>
                  {({ errors, touched, isValidating }) => (
                    <Form >
                      <div className="mb-2">
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

                      <button className='btn btn-sm btn-outline-secondary' type='reset' onClick={() => setChangeEmailToggle(false)}>Cancel</button>
                      <button className='btn btn-sm btn-success' style={{ marginLeft: "10px" }} type='submit' disabled={isLoading}>
                        {isLoading ? <CircularProgress color="inherit" size="20px" /> : "Save Change"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            )
          }

        </div>
        <div className="about-info-item change-password-wrap">
          {(isCurrentUser && !changePassToggle && !changeEmailToggle) && <button className='btn btn-outline-secondary btn-sm' onClick={() => setChangePassToggle(true)}>Change Password</button>}

          {
            changePassToggle && (
              <div className="change-password-input">
                <b>Change your password</b>
                <p>Try to make a strong password.(symbol, uppercase letter, lowercase letter, and number)</p>
                <Formik
                  initialValues={changePasswordInitialValues}
                  validationSchema={changePasswordValidationSchema}
                  onSubmit={changePasswordSubmit}>
                  {({ errors, touched, isValidating }) => (
                    <Form >
                      <div className="mb-2 mt-2">
                        <Field
                          type="password"
                          name="currentPassword"
                          className={`form-control ${(errors.currentPassword && touched.currentPassword) && 'is-invalid'}`}
                          placeholder="Current Password"
                        />
                        <ErrorMessage
                          name="currentPassword"
                          className="text-danger"
                          component={TextError}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          type="password"
                          name="newPassword"
                          className={`form-control ${(errors.newPassword && touched.newPassword) && 'is-invalid'}`}
                          placeholder="New Password"
                        />
                        <ErrorMessage
                          name="newPassword"
                          className="text-danger"
                          component={TextError}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          type="password"
                          name="confirmPassword"
                          className={`form-control ${(errors.confirmPassword && touched.confirmPassword) && 'is-invalid'}`}
                          placeholder="Confirm New Password"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          className="text-danger"
                          component={TextError}
                        />
                      </div>

                      <button className='btn btn-sm btn-outline-secondary' type='reset' onClick={() => setChangePassToggle(false)}>Cancel</button>
                      <button className='btn btn-sm btn-success' style={{ marginLeft: "10px" }} type='submit' disabled={isLoading}>
                        {isLoading ? <CircularProgress color="inherit" size="20px" /> : "Save Change"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            )
          }
        </div>
      </div>
    </>
  )
}

export default About