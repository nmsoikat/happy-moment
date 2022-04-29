import '../login/login.css';
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import TextError from "../../components/textError/TextError";
import {API_URL} from '../../Constant'

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPass: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name can not be empty!").min(2, "Too short!"),
  lastName: Yup.string().required("Last name can not be empty!").min(2, "Too short!"),
  email: Yup.string().required("Email can not be empty!").email("Invalid email format!"),
  password: Yup.string().required("Password can not be empty!").min(6, "Too short!"),
  confirmPass: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Password must match!"
  ),
});



export default function Register() {

  const navigate = useNavigate()

  const onSubmit = async (values) => {
    try {
      await axios.post(`${API_URL}/auth/register`, values)
      navigate('/login')
    } catch (error) {
      console.log(error);
    }
  };

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
                <h1 className="display-5 text-center">Create A New Account</h1>
                <div className="row mb-2 mt-4">
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="firstName"
                      className={`form-control ${(errors.firstName && touched.firstName) && 'is-invalid'}`}
                      placeholder="First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      className="text-danger"
                      component={TextError}
                    />
                  </div>
                  <div className="col-md-6">
                    <Field
                      type="text"
                      name="lastName"
                      className={`form-control ${(errors.lastName && touched.lastName) && 'is-invalid'}`}
                      placeholder="Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      className="text-danger"
                      component={TextError}
                    />
                  </div>
                </div>

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

                <button className='login-btn w-100 mt-4' type='submit'>Sign Up</button>
                <button type='button' className='register-btn mx-auto d-block'>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'white', display: 'block' }}>Log Into Account
                  </Link>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  </>;
}
