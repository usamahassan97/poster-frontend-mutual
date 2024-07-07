import React from 'react'
import { Card, Form, Input, Label } from 'reactstrap'
import BtnLg from '../components/Buttons/BtnLg'
import DarkBtn from '../components/Buttons/DarkBtn'
import "../styles/pages.style.css"
import logo from "../assets/images/logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUser } from '../apis/auth'
import ribbs from "../assets/images/large_ribbon.png"
import ribb from "../assets/images/small_ribbon.png"



const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: ""
  })


  // const token = localStorage.getItem('token');

  // if (token) {
  //   navigate("/home")
  // }else {
  //   navigate("/login")
  // }


  const validateForm = () => {
    const { email, password } = userData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (password.trim() === '') {
      toast.error('Password is required');
      return false;
    }
    return true;
  };


  const handleUserData = (event) => {
    const { name, value } = event.target;
    setUserData(() => {
      return {
        ...userData,
        [name]: value
      };
    });

    console.log('object', userData);
  }


  const submitUser = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(loginUser({ body: userData, navigation: navigate }));
    }
  };


  return (
    <>
      <div className='p-5'>
        <div className='mt-1'>
          <img src={logo} alt="#" className='main_logo' />
        </div>
        <div className='d-flex justify-content-center align-items-center'>
          <Card className='border-0 login_card '>
            <img src={ribbs} alt="" className='ribbon_style' />
            <div className='text-center me-lg-5 ms-lg-5 p-5'>
              <p className='fs-4 fw-bold mt-lg-4'>Let's Sign you In</p>
              <BtnLg value={"Sign In with Google"} />
              <p className='fs-5 mt-3'>or</p>

              <Form>
                <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                  <Label>Email</Label>
                </div>
                <Input type='email' placeholder='John Deo' name='email' className='input_bg' value={userData.email} onChange={handleUserData} />

                <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                  <Label>Password</Label>
                </div>
                <Input type='password' placeholder='John Deo' name='password' className='input_bg' value={userData.password} onChange={handleUserData} />

                <div className='d-flex justify-content-between mt-2'>
                  <div>
                    <Input type="checkbox" />
                    <Label check className='ms-1'>
                      Remember me
                    </Label>
                  </div>

                  <div>
                    <Link to='/forgotPassword' className='link_class'><p className='links'>Forgot Password?</p></Link>
                  </div>
                </div>

                <div>

                </div>

                <div className='mt-3'>
                  <DarkBtn value={"Sign In"} onClick={submitUser} />
                  <div className='d-flex justify-content-start'>
                    <p className='mt-3'>No Account Yet? <Link to="/register" className='link_class'><span className='links'>Sign Up</span></Link> </p>
                  </div>
                </div>
              </Form>


            </div>
            <img src={ribb} alt="" className='ribbs_style' />

          </Card>
        </div>
      </div>
    </>
  )
}

export default Login