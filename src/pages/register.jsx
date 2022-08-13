import React, { useEffect, useState } from "react";
import Axios from "axios";
import 'mdb-ui-kit/css/mdb.min.css';
import { MdArrowRight, MdEmail, MdPassword, MdPerson } from 'react-icons/md'
import '../css/signup.css'
import { Link } from "react-router-dom";
import { loadCaptchaEnginge, LoadCanvasTemplate, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { BarLoader, CircleLoader, ClimbingBoxLoader, ClipLoader, SyncLoader } from "react-spinners";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import mode from "../mode";

export default function Register() {
    document.title = 'Mockbest - Register';

    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [repeatedPasswordReg, setRepeatedPasswordReg] = useState("");
    const [displayNameReg, setDisplayNameReg] = useState("");
    const [newsletter, setNewsletter] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [captchaPage, setCapthcaPage] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");

    const [loginStatus, setLoginStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    Axios.defaults.withCredentials = true;

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const error = (string) => {
        toast.error(string, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const register = () => {
        setIsLoading(true);
        //Do the validating of the values before sending to server
        if (displayNameReg.trim().length != 0) {
            if (validateEmail(usernameReg)) {
                if (passwordReg.length > 7) {
                    //In the end pass the data to the server
                    Axios.post(mode === 0 ? "http://localhost:3001/online-examination/api/register" : "http://examination.mockbest.com/online-examination/api/register", {
                        username: usernameReg,
                        password: passwordReg,
                        displayName: displayNameReg,
                        newsletterAllowed: newsletter
                    }).then((response) => {
                        console.log(response)
                        if (response.data.error) {
                            setIsLoading(false);
                            error(response.data.message);
                        } else window.location = '/login?new=1'
                    }).catch(err => error(err));
                } else error("Your password must be at least 8 characters long.")
            } else error("Your email address is invalid.")
        } else error("You must provide your name to continue.")
    };

    useEffect(() => {
        //document.querySelector('body').style = 'overflow: hidden !important'
        document.querySelector('body').style = 'background-color: #eee';
        //loadCaptchaEnginge(6); WE WILL LOAD CAPTCHA AFTER PAGE 2 IS DISPLAYED
        //setTimeout(() => { loadCaptchaEnginge(6) }, 200)
        Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "http://examination.mockbest.com/online-examination/api/login").then((response) => {
            if (response.data.loggedIn == true) {
                setLoginStatus(response.data.user[0].username);
                window.location = '/';
            }
        });
    }, []);

    var doSubmit = () => {
        if (validateCaptcha(captchaValue) == true) {
            setCapthcaPage(false);
            register();
        }
        else {
            error('Captcha does not match');
        }
    };

    var nextPage = () => {
        setTimeout(() => { loadCaptchaEnginge(6) }, 200)
        //Known issue with this library. We need to load the captha engine after the canvas is rendered to the document, if we don't to this we will get canvas is null

        //We load the next page only if the data is collected correctly
        if (displayNameReg.trim().length != 0) {
            if (validateEmail(usernameReg)) {
                if (passwordReg.length > 7) {
                    if (passwordReg == repeatedPasswordReg) {
                        setCapthcaPage(true);
                    } else error("Your passwords do not match.")
                } else error("Your password must be at least 8 characters long.")
            } else error("Your email address is invalid.")
        } else error("You must provide your name to continue.")
    }

    return (
        <div className="App">
            <ToastContainer />

            < section style={{ backgroundColor: '#eee', paddingTop: 30, paddingBottom: 30 }
            }>
                {isLoading ? (
                    <>
                        <BarLoader style={{ width: window.innerWidth }} />

                        <div className="d-flex align-items-center flex-column" style={{ paddingTop: window.innerHeight / 2 - 100 }}>
                            <img style={{ flex: 1 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="container" style={{ width: '100%', background: 'url("/graphics/registration-left.png")' }}>
                            <div class="row d-flex justify-content-center align-items-center h-100">
                                <div class="col-lg-12 col-xl-11">
                                    <div class="card text-black" style={{ borderRadius: 25 }}>
                                        <div class="card-body p-md-5">
                                            <div class="row justify-content-center">

                                                {captchaPage ? (
                                                    <div class="col-md-10 col-lg-6 ">
                                                        <img style={{ flex: 1 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />

                                                        <div className="mt-5" style={{ display: 'flex', flexDirection: 'row' }}>
                                                            <img src="/graphics/robot.png" style={{ flex: 1, width: 100, height: 100, margin: 'auto' }} />
                                                            <p style={{ flex: 5, fontFamily: 'Poppins' }} class="text-left h2 fw-bold mx-1 mx-md-4 mt-4">Please prove you are not a robot.</p>
                                                        </div>

                                                        <div className="d-flex justify-content-center mb-5 mt-5" >
                                                            <LoadCanvasTemplateNoReload />
                                                            <br />
                                                            <input type="text" onChange={(e) => setCaptchaValue(e.target.value)} />
                                                        </div>

                                                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                            <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn btn-primary btn-lg" onClick={() => doSubmit()}>Continue</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div class="col-md-10 col-lg-6">
                                                        <img className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                                        <p class="text-left h1 fw-bold mx-1 mx-md-4 mt-4">Join us today</p>
                                                        <Link to='/login' className='mx-1 mx-md-4 mt-4'>Already have an account?</Link>

                                                        <form class="mx-1 mx-md-4 mt-3">
                                                            <span>Name</span>
                                                            <div class="d-flex flex-row align-items-center mb-4">
                                                                <MdPerson style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                                <div class="form-outline flex-fill mb-0">
                                                                    <input type="text" id="form3Example1c" class="form-control" onChange={(e) => {
                                                                        setDisplayNameReg(e.target.value);
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <span>Email address</span>
                                                            <div class="d-flex flex-row align-items-center mb-4">
                                                                <MdEmail style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                                <div class="form-outline flex-fill mb-0">
                                                                    <input type="email" id="form3Example3c" class="form-control" onChange={(e) => {
                                                                        setUsernameReg(e.target.value);
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <span>Choose a password</span>
                                                            <div class="d-flex flex-row align-items-center mb-4">
                                                                <MdPassword style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                                <div class="form-outline flex-fill mb-0">
                                                                    <input type="password" id="form3Example4c" class="form-control" onChange={(e) => {
                                                                        setPasswordReg(e.target.value);
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <span>Repeat the password</span>
                                                            <div class="d-flex flex-row align-items-center mb-4">
                                                                <MdPassword style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                                <div class="form-outline flex-fill mb-0">
                                                                    <input type="password" id="form3Example4c" class="form-control" onChange={(e) => {
                                                                        setRepeatedPasswordReg(e.target.value);
                                                                    }} />
                                                                </div>
                                                            </div>

                                                            <div class="d-flex mb-2">
                                                                <input class="form-check-input" onChange={(e) => setNewsletter(e.target.value)} type="checkbox" value="" id="form23" />
                                                                <label class="form-check-label" for="form23">
                                                                    I agree receiving Mockbest newsletter via email.
                                                                </label>
                                                            </div>
                                                            <label class="form-check-label" onClick={() => { window.open('https://mockbest.com/privacy-policy') }}>
                                                                <b>By clicking Continue I accept the privacy policy of Mockbest and I want to continue the registration process.</b>
                                                            </label>

                                                            <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4 mt-4">
                                                                <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn btn-primary btn-lg" onClick={() => nextPage()}>Continue</button>
                                                            </div>

                                                        </form>
                                                    </div>
                                                )}


                                                <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2 image-container">
                                                    {/*<img src="/graphics/lesson-rafiki.png"
                                                            class="img-fluid" alt="Register" />*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>)}
            </section >
        </div >
    );
}