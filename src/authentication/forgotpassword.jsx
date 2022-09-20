import React from 'react';
import mode from '../mode';
import { Link } from 'react-router-dom';
import { LoadCanvasTemplate, LoadCanvasTemplateNoReload, loadCaptchaEnginge, validateCaptcha } from 'react-simple-captcha';
import { MdArrowBackIos, MdLogin, MdNotifications, MdSettings, MdSms } from 'react-icons/md';
import { toast, Toast, ToastContainer } from 'react-toastify';
import Axios from 'axios';
import { VscAccount } from 'react-icons/vsc';

export default class ForgotPassword extends React.Component {
    state = {
        page: 0,
        email: '',
        captchaValue: '',
        captchaCharacters: 6,
        enteredCode: null,
        newpassword: '',
    }

    /*
        To dos:
        X create visual feedback of the changing of password
        X verify google login over email login
        X personalize the frontend
        X bug found: when account is created with google please change login_type to 0 on password changing (fixed)
        UPDATE `examination_platform`.`users` SET `password` = '.', `last_logged_in` = '.', `login_type` = '0' WHERE (`userid` = '101989120649016535817');
        - debug and optimize everything (backend) PLEASE SAVE BACKUP
        X bug found: duplicate entry for 0 when logging in with email (fixed)
    */

    error(message) {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
        });
        console.error(message)
    }

    verify() {
        this.setState({ page: 3 });

        if (validateCaptcha(this.state.captchaValue)) {
            //send code request
            Axios.post(mode === 0 ? "http://localhost:3001/online-examination/api/reset-password" : "https://examination.mockbest.com/online-examination/api/reset-password", {
                to: this.state.email,
            }).then((response) => {
                if (response.data.error) {
                    this.setState({ error: response.data.message, page: 0 });
                    this.error(response.data.message);
                } else if (response.data.success) this.setState({ page: 2 });
            }).catch(err => {
                this.error("Unexpected error occured.");
            });
        } else {
            this.error("The captcha is invalid. Please try again.");
            this.setState({ page: 1, captchaValue: '', captchaCharacters: this.state.captchaCharacters + 1 });
        }
    }


    validate() {
        this.setState({ page: 3 })
        //console.log(this.state.enteredCode.length)
        if (this.state.enteredCode.length == 10) {
            Axios.post(mode === 0 ? "http://localhost:3001/online-examination/api/reset-password/verification" : "https://examination.mockbest.com/online-examination/api/reset-password/verification", {
                to: this.state.email,
                code: this.state.enteredCode,
                password: this.state.newpassword
            }).then((response) => {
                if (response.data.error) {
                    this.setState({ page: 2 })
                    this.error(response.data.message);
                } else {
                    //Success
                    window.location = '../../login?new=2'
                }
            }).catch(err => this.error("Unexpected error occured."));
        } else {
            this.setState({ page: 2 })
            this.error("The verification code must be at least 10 characters.")
        }
    }

    validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    render() {
        console.log(this.state)
        switch (this.state.page) {
            case 0: {
                return (
                    <>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container-fluid justify-content-between">
                                <div class="d-flex">
                                    <a href='../../login' class="nav-link d-flex align-items-center">
                                        <span><MdArrowBackIos color='black' style={{ cursor: 'pointer' }} size={20} /></span>
                                    </a>

                                    <a class="navbar-brand d-flex align-items-center">
                                        <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                    </a>
                                </div>


                                <ul class="navbar-nav flex-row">
                                    <li class="nav-item me-3 me-lg-1">
                                        <a class="nav-link d-sm-flex align-items-sm-center" href="../../login">
                                            <MdLogin />
                                            <strong class="d-none d-sm-block ms-1">Log In</strong>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <ToastContainer />
                        <div class="card-body p-md-5">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                    <img className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                    <p class="text-left h1 fw-bold mx-1 mx-md-4 mt-4">Reset your password</p>

                                    <form class="mx-1 mx-md-4 mt-3">
                                        <span>Email address</span>
                                        <div class="d-flex flex-row align-items-center mb-2">
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="email" id="form3Example3c" class="form-control" onChange={(e) => { this.setState({ email: e.target.value }) }} />
                                            </div>
                                        </div>

                                        <span>New password</span>
                                        <div class="d-flex flex-row align-items-center mb-2">
                                            <div class="form-outline flex-fill mb-0">
                                                <input type="password" class="form-control" onChange={(e) => { this.setState({ newpassword: e.target.value }) }} />
                                            </div>
                                        </div>

                                        <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn-login" onClick={() => {
                                            if (this.validateEmail(this.state.email) && this.state.email != "") { this.setState({ page: 1 }); setTimeout(() => { loadCaptchaEnginge(this.state.captchaCharacters) }, 200); }
                                            else {
                                                toast.error("The email address you entered is not valid.", {
                                                    position: "top-right",
                                                    autoClose: 5000,
                                                    hideProgressBar: false,
                                                    closeOnClick: true,
                                                    pauseOnHover: true,
                                                    draggable: true,
                                                    progress: undefined,
                                                });
                                            }
                                        }}>Continue</button>
                                        <a href='../../login' className='forgot-password'>Go Back</a>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            case 1: {
                return (
                    <>
                        <ToastContainer />

                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container-fluid justify-content-between">
                                <div class="d-flex">
                                    <Link to='../../login' class="nav-link d-flex align-items-center">
                                        <span><MdArrowBackIos color='black' style={{ cursor: 'pointer' }} size={20} /></span>
                                    </Link>

                                    <a class="navbar-brand d-flex align-items-center" href="#">
                                        <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                    </a>
                                </div>


                                <ul class="navbar-nav flex-row">
                                    <li class="nav-item me-3 me-lg-1">
                                        <a class="nav-link d-sm-flex align-items-sm-center" href="../../login">
                                            <MdLogin />
                                            <strong class="d-none d-sm-block ms-1">Log In</strong>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <div class="card-body p-md-5">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 ">
                                    <div className="mt-5" style={{ display: 'flex', flexDirection: 'row' }}>
                                        <img src="/graphics/robot.png" style={{ flex: 1, width: 100, height: 100, margin: 'auto' }} />
                                        <p style={{ flex: 5, fontFamily: 'Poppins' }} class="text-left h2 fw-bold mx-1 mx-md-4 mt-4">Please prove you are not a robot.</p>
                                    </div>

                                    <div className="d-flex justify-content-center mb-5 mt-5" >
                                        <LoadCanvasTemplateNoReload />
                                        <br />
                                        <input value={this.state.captchaValue} onChange={(e) => this.setState({ captchaValue: e.target.value })} type="text" />
                                    </div>

                                    <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                        <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn btn-primary btn-lg" onClick={() => this.verify()}>Continue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            case 2: {
                return (
                    <>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container-fluid justify-content-between">
                                <div class="d-flex">
                                    <Link to='../../login' class="nav-link d-flex align-items-center">
                                        <span><MdArrowBackIos color='black' style={{ cursor: 'pointer' }} size={20} /></span>
                                    </Link>

                                    <a class="navbar-brand d-flex align-items-center" href="#">
                                        <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                    </a>
                                </div>


                                <ul class="navbar-nav flex-row">
                                    <li class="nav-item me-3 me-lg-1">
                                        <a class="nav-link d-sm-flex align-items-sm-center" href="../../login">
                                            <MdLogin />
                                            <strong class="d-none d-sm-block ms-1">Log In</strong>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <ToastContainer />

                        <div class="card-body p-md-5">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 ">
                                    <img style={{ flex: 1 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />


                                    <p style={{ fontFamily: 'Poppins' }} class="text-left h2 fw-bold mt-3">Confirm your email.</p>
                                    <p>Please enter the code sent to <code>{this.state.email}</code></p>
                                    <input type="text" onChange={(e) => this.setState({ enteredCode: e.target.value })} maxLength={10} style={{ textAlign: 'center' }} />

                                    <div class="d-flex mx-4 mb-3 mb-lg-4 mt-5">
                                        <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn btn-primary btn-lg" onClick={() => this.validate()}>Continue</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            case 3: {
                return (
                    <>
                        <nav class="navbar navbar-expand-lg navbar-light bg-light">
                            <div class="container-fluid justify-content-between">
                                <div class="d-flex">
                                    <Link to='../../login' class="nav-link d-flex align-items-center">
                                        <span><MdArrowBackIos color='black' style={{ cursor: 'pointer' }} size={20} /></span>
                                    </Link>

                                    <a class="navbar-brand d-flex align-items-center" href="#">
                                        <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                    </a>
                                </div>


                                <ul class="navbar-nav flex-row">
                                    <li class="nav-item me-3 me-lg-1">
                                        <a class="nav-link d-sm-flex align-items-sm-center" href="../../login">
                                            <MdLogin />
                                            <strong class="d-none d-sm-block ms-1">Log In</strong>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <ToastContainer />

                        <div class="card-body p-md-5">
                            <p>Loading...</p>
                        </div>
                    </>
                )
            }
        }
    }
}