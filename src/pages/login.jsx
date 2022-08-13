import React, { useEffect, useState } from "react";
import Axios from "axios";
import 'mdb-ui-kit/css/mdb.min.css';
import { MdArrowRight, MdEmail, MdPassword, MdPerson } from 'react-icons/md'
import '../css/signup.css'
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { toast, ToastContainer } from "react-toastify";
import mode from "../mode";

export default function Login() {
    document.title = 'Mockbest - Login';

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [googleLoginData, setGoogleLoginData] = useState(
        localStorage.getItem('loginData')
            ? JSON.parse(localStorage.getItem('loginData'))
            : null
    );

    Axios.defaults.withCredentials = true;

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    //Will add timestamp
    function currentTimeStamp() {
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth() + 1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' +
            ('00' + date.getUTCHours()).slice(-2) + ':' +
            ('00' + date.getUTCMinutes()).slice(-2) + ':' +
            ('00' + date.getUTCSeconds()).slice(-2);

        return date;
    }

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
    /*
    const handleGoogleFailure = (result) => {
        alert(result);
    };

    const handleGoogleLogin = async (googleData) => {
        const res = await fetch('http://127.0.0.1:3001/api/google-login', {
            method: 'POST',
            body: JSON.stringify({
                token: googleData.tokenId,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await res.json();
        setGoogleLoginData(data);
        //localStorage.setItem('loginData', JSON.stringify(data));
        console.log(data)
    };

    const handleGoogleLogout = () => {
        localStorage.removeItem('loginData');
        setGoogleLoginData(null);
    };
    */

    const login = () => {
        if (validateEmail(username)) {
            if (password.length > 7) {
                setLoading(true);
                //In the end pass the data to the server
                Axios.post(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "http://examination.mockbest.com/online-examination/api/login", {
                    username: username,
                    password: password,
                }).then((response) => {
                    if (response.data.error) {
                        setLoading(false);
                        error(response.data.message)
                    } else {
                        //setLoginStatus(true);
                        window.location = '../?c=0';
                    }
                })
            } else error("Your password must be at least 8 characters long.")
        } else error("Your email address is invalid.")
    };

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get('new') != null) {
            console.log("yes")
            toast.success("Your account has been created successfully! Please login!")
        }

        Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "http://examination.mockbest.com/online-examination/api/login").then((response) => {
            if (response.data.loggedIn == true) {
                //setLoginStatus(true);
                window.location = '../';
            }
        });
    }, []);

    return (
        <div className="App">
            <ToastContainer />

            <section class="vh-100" style={{ backgroundColor: '#eee' }
            }>
                <div class="container h-100">
                    <div class="row d-flex justify-content-center align-items-center h-100">
                        <div class="col-lg-12 col-xl-11">
                            <div class="card text-black" style={{ borderRadius: 25 }}>
                                <div class="card-body p-md-5">
                                    <div class="row justify-content-center">
                                        <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                                            <img className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                                            <p class="text-left h1 fw-bold mx-1 mx-md-4 mt-4">Log into your account</p>
                                            <Link to='/register' className='mx-1 mx-md-4 mt-4'>Don't you have an account?</Link>

                                            <form class="mx-1 mx-md-4 mt-3">

                                                <span>Email address</span>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <MdEmail style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                    <div class="form-outline flex-fill mb-0">
                                                        <input type="email" id="form3Example3c" class="form-control" onChange={(e) => {
                                                            setUsername(e.target.value);
                                                        }} />
                                                    </div>
                                                </div>

                                                <span>Password</span>
                                                <div class="d-flex flex-row align-items-center mb-4">
                                                    <MdPassword style={{ width: 20, height: 20, color: 'rgba(0,0,0,0.7)' }} />
                                                    <div class="form-outline flex-fill mb-0">
                                                        <input type="password" id="form3Example4c" class="form-control" onChange={(e) => {
                                                            setPassword(e.target.value);
                                                        }} />
                                                    </div>
                                                </div>
                                                {/*
                                                <GoogleLogin
                                                    className="mb-4 mx-4 mb-3 mb-lg-4"
                                                    clientId={"95619042713-f74ei4ar78dk9aina2fpg1vo4oop1n94.apps.googleusercontent.com"}
                                                    buttonText="Log in with Google"
                                                    onSuccess={handleGoogleLogin}
                                                    onFailure={() => { }}
                                                    cookiePolicy={'single_host_origin'}
                                                ></GoogleLogin>*/}

                                                <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                    <button style={{ textTransform: 'none', letterSpacing: 0.4 }} type="button" class="btn btn-primary btn-lg" onClick={login}>Log In</button>
                                                </div>
                                            </form>

                                        </div>
                                        {window.innerWidth <= 575 ? (
                                            <></>
                                        ) : (
                                            <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2 image-container">
                                                <img src="/graphics/lesson-rafiki.png"
                                                    class="img-fluid" alt="Register" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}