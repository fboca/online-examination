import React from 'react'
import { MdSearch, MdHome, MdFlag, MdSettings, MdNotifications, MdSchool, MdArchive, MdPeople, MdLogin, MdPersonAdd, MdOutlineLogin, MdOutlineAppRegistration, MdAccountCircle } from 'react-icons/md'
import mode from '../mode';
import { VscAccount } from 'react-icons/vsc'
import Axios from "axios";
import { Link } from 'react-router-dom';

export default class Navbar extends React.Component {
    state = {
        user: null,
    }

    componentDidMount() {
        Axios.defaults.withCredentials = true;

        Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "https://examination.mockbest.com/online-examination/api/login").then((response) => {
            if (response.data.loggedIn == true) {
                //setLoginStatus(true);
                //window.location = 'https://mockbest.com?success=1';
                this.setState({ user: response.data.user[0] })
                //this.setState({ user: response.data.user })
            }
        });
    }

    render() {
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid justify-content-between">
                    <div class="d-flex">
                        <a class="navbar-brand me-2 mb-1 d-flex align-items-center" href="#">
                            <img style={{ height: 50, width: 130 }} className="signup_logo_brand" src="/graphics/mockbest_logo_512_200.png" />
                        </a>
                    </div>

                    <ul class="navbar-nav flex-row d-none d-md-flex">
                        <li class="nav-item me-3 me-lg-1 active">
                            <a class="nav-link" href="#">
                                <span><MdHome size={20} /></span>
                            </a>
                        </li>

                        <li class="nav-item me-3 me-lg-1">
                            <a class="nav-link" href="#">
                                <span><MdFlag size={20} /></span>
                                <span class="badge rounded-pill badge-notification bg-danger">2</span>
                            </a>
                        </li>

                        <li class="nav-item me-3 me-lg-1">
                            <a class="nav-link" href="#">
                                <span><MdSchool size={20} /></span>
                            </a>
                        </li>
                    </ul>

                    <ul class="navbar-nav flex-row">

                        {this.state.user != null ? (
                            <li class="nav-item me-3 me-lg-1">
                                <Link class="nav-link d-sm-flex align-items-sm-center" to="/account">
                                    <VscAccount size={25} style={{ marginRight: 3, paddingBottom: 3 }} />
                                    <b class="d-none d-sm-block ms-1">{this.state.user.displayname}</b>
                                </Link>
                            </li>
                        ) : (
                            <>
                                <li class="nav-item me-3 me-lg-1">
                                    <a href='/login' class="nav-link d-sm-flex align-items-sm-center">
                                        <strong class="d-none d-sm-block ms-1">Log In</strong>
                                        <MdLogin style={{ marginLeft: 5 }} />
                                    </a>
                                </li>

                                <li class="nav-item me-3 me-lg-1">
                                    <a href='/register' class="nav-link d-sm-flex align-items-sm-center">
                                        <strong class="d-none d-sm-block ms-1">Create an account</strong>
                                        <MdLogin style={{ marginLeft: 5 }} />
                                    </a>
                                </li>
                            </>
                        )}


                        <li class="nav-item me-3 me-lg-1">
                            <a class="nav-link" href="#">
                                <span><i class="fas fa-plus-circle fa-lg"></i></span>
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
        )
    }
}