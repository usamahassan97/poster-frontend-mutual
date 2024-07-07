import React from 'react'
import { Card, Col, Form, Input, Label, Row } from 'reactstrap'
// import LogoComponent from '../layout-components/LogoComponent'
import register from "../assets/images/register.png"
import "../styles/pages.style.css"
import BtnLg from '../components/Buttons/BtnLg'
import google from "../assets/icons/google.png"
import DarkBtn from '../components/Buttons/DarkBtn'
import logo from "../assets/images/logo.png"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { registerUser } from '../apis/auth'
import { toast } from 'react-toastify'

const Register = () => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [regUser, setRegUser] = useState({
    full_name: "",
    email: "",
    password: ""
  })

  const validateForm = () => {
    const { full_name, email, password } = regUser;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (full_name.trim() === '') {
      toast.error('Name is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.error('Password must be at least 8 characters long and contain both letters and numbers');
      return false;
    }
    return true;
  };

  const handleUser = (event) => {
    const { name, value } = event.target;
    setRegUser(() => {
      return {
        ...regUser,
        [name]: value
      };
    });

    console.log('object', regUser);
  }

  const userRegister = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(registerUser({ ...regUser }));
      toast.success('user registered successfully')
    }
  };

  return (
    <>
      <div className='p-4'>
        <Row>
          <Col md={6}>
            <div className='d-flex justify-content-start'>
              <img src={logo} alt="" className='main_logo' />
            </div>

            <div className='d-flex justify-content-center align-items-center'>
              <p className='text-center fs-2 fw-bold mt-lg-5'>
                Create , Schedule <br /> Publish
              </p>
            </div>

            <div className='d-flex justify-content-center align-items-center mt-lg-5'>
              <img src={register} alt="" className='reg_side_img' />
            </div>

          </Col>
          <Col md={6}>
            <Card className='shadow border-0'>
              <div className='text-center me-lg-5 ms-lg-5 p-5'>
                <p className='fs-4 fw-bold mt-lg-4'>Sign Up with</p>
                <BtnLg value={"Google"} />
                <p className='fs-5 mt-3'>or</p>

                <Form>
                  <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                    <Label>Name</Label>
                  </div>
                  <Input type='text' name='full_name' placeholder='John Deo' className='input_bg' value={regUser.full_name} onChange={handleUser} />

                  <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                    <Label>Email</Label>
                  </div>
                  <Input type='email' placeholder='John Deo' name='email' className='input_bg' value={regUser.email} onChange={handleUser} />

                  <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                    <Label>Password</Label>
                  </div>
                  <Input type='password' placeholder='John Deo' name='password' className='input_bg' value={regUser.password} onChange={handleUser} />

                  <div className='mt-4'>
                    <DarkBtn value={"SignUp"} onClick={userRegister} />
                    <p className='mt-2'>Already have an account ? <Link to="/login" className='link_class'><span className='links'>Login</span></Link> </p>
                  </div>
                </Form>

                <div>
                  <p>
                    By signing up, you agree to our <span className='links'>Terms of service </span> and <br />
                    acknowledge our <span className='links'>Privacy policy </span>
                  </p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Register