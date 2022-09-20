import React from 'react';
import Axios from "axios";
import mode from '../mode';
import { MdSearch, MdHome, MdFlag, MdSettings, MdNotifications, MdSchool, MdArchive, MdPeople, MdArrowBackIosNew, MdArrowBack, MdArrowBackIos, MdLogin } from 'react-icons/md'
import { Link } from 'react-router-dom';
import '../css/account.css'
import { VscAccount } from 'react-icons/vsc';

export default class Account extends React.Component {
    state = {
        user: null,
        createdTimestamp: null,
        isPfp: false,
    }

    componentDidMount() {
        Axios.defaults.withCredentials = true;

        Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "https://examination.mockbest.com/online-examination/api/login").then((response) => {
            if (response.data.loggedIn == true) {
                //setLoginStatus(true);
                //window.location = 'https://mockbest.com?success=1';
                this.setState({ user: response.data.user[0], isPfp: (response.data.user[0].profile_picture != null) })
            } else {
                window.location = '/login'
            }
        });
    }

    render() {
        console.log(this.state)
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-light">
                    <div class="container-fluid justify-content-between">
                        <div class="d-flex">
                            <Link to='..' class="nav-link d-flex align-items-center">
                                <span><MdArrowBackIosNew color='black' style={{ cursor: 'pointer' }} size={20} /></span>
                            </Link>

                            <a class="navbar-brand d-flex align-items-center" href="#">
                                <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                            </a>
                        </div>


                        <ul class="navbar-nav flex-row">
                            <li class="nav-item me-3 me-lg-1">
                                {this.state.user != null ? (
                                    <Link class="nav-link d-sm-flex align-items-sm-center" to="/account">
                                        <Link class="nav-link d-sm-flex align-items-sm-center" to="/account">
                                            <VscAccount size={25} style={{ marginRight: 3, paddingBottom: 3 }} />
                                            <b class="d-none d-sm-block ms-1">{this.state.user.displayname}</b>
                                        </Link>
                                    </Link>
                                ) : (
                                    <a class="nav-link d-sm-flex align-items-sm-center" href="#">
                                        <MdLogin />
                                        <strong class="d-none d-sm-block ms-1">Log In</strong>
                                    </a>
                                )}

                            </li>
                            <li class="nav-item me-3 me-lg-1">
                                <a class="nav-link" href="#">
                                    <span><i class="fas fa-plus-circle fa-lg"></i></span>
                                </a>
                            </li>

                            <li class="nav-item me-3 me-lg-1">
                                <a class="nav-link" href="#">
                                    <span><MdNotifications size={20} /></span>
                                    <span class="badge rounded-pill badge-notification bg-danger">2</span>
                                </a>
                            </li>
                            <li class="nav-item me-3 me-lg-1">
                                <a class="nav-link" href="#">
                                    <span><MdSettings size={20} /></span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <div class="card card-ac d-flex justify-content-center align-items-center">
                    <div class="bg-image hover-overlay ripple pfp">
                        <img src={this.state.isPfp ? this.state.user.profile_picture : "http://simpleicon.com/wp-content/uploads/account.png"} class="img-fluid pfp" />
                        <a href="#">
                            <div class="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                        </a>
                    </div>
                    <div class="card-header">{this.state.user != null ? this.state.user.displayname : ''}</div>
                    <div class="card-body">
                        <button type="button" onClick={() => {
                            Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/logout" : "https://examination.mockbest.com/online-examination/api/logout").then((response) => {
                                window.location.reload()
                            });
                        }} class="btn btn-primary">Log Out</button>
                    </div>
                    <div class="card-footer">
                        <p>Account created on {this.state.user != null ? this.state.user.created : ''}</p>
                    </div>
                </div>
            </div>
        )
    }
}