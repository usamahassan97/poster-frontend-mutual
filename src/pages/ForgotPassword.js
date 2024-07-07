import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Form, Input, Label } from 'reactstrap'
import logo from "../assets/images/logo.png"
import DarkBtn from '../components/Buttons/DarkBtn'
import "../styles/pages.style.css"



const ForgotPassword = () => {
    return (
        <>
            <div className='p-5'>
                <div className='mt-1'>
                    <img src={logo} alt="" className='main_logo' />
                </div>

                <div className='d-flex justify-content-center align-items-center'>
                    <Card className='border-0 login_card'>
                        <div className='text-center me-lg-5 ms-lg-5 p-5 mb-5'>
                            <p className='fs-4 fw-bold mt-lg-5'>Forgot Password</p>
                            <span className='desc_pass'>Enter you Email to reset your password</span>

                            <Form className='mt-5'>
                                <div className='d-flex justify-content-start fs-6 fw-bold pt-3'>
                                    <Label>Email</Label>
                                </div>
                                <Input type='email' placeholder='John Deo' className='input_bg mt-2' />

                                <div className='mt-5'>
                                   <Link to="/verify"> <DarkBtn value={"Get Email"} /> </Link>
                                </div>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword