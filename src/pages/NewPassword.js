import React from 'react'
import { Card, Form, Input, Label } from 'reactstrap'
import logo from "../assets/images/logo.png"
import DarkBtn from '../components/Buttons/DarkBtn'
import "../styles/pages.style.css"

const NewPassword = () => {
    return (
        <>
            <div className='p-5'>
                <div className='mt-1'>
                    <img src={logo} alt="" className='main_logo' />
                </div>

                <div className='d-flex justify-content-center align-items-center'>
                    <Card className='border-0 login_card'>
                        <div className='text-center me-lg-5 ms-lg-5 p-5 mb-5'>
                            <p className='fs-4 fw-bold mt-lg-5'>Create New Password</p>
                            <span className='desc_pass'>Enter your new password</span>

                            <Form className='mt-5'>
                                <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                                    <Label>New Password</Label>
                                </div>
                                <Input type='password' placeholder='**********' className='input_bg' />

                                <div className='d-flex justify-content-start fs-6 fw-bold mt-3'>
                                    <Label>Confirm Password</Label>
                                </div>
                                <Input type='password' placeholder='**********' className='input_bg' />

                                <div className='mt-5'>
                                    <DarkBtn value={"Confirm Password"} />
                                </div>
                            </Form>
                        </div>
                    </Card>
                </div>
            </div>

        </>
    )
}

export default NewPassword