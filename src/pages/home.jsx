import Axios from "axios";
import React from "react";
import Navbar from "../components/navbar";
import mode from '../mode';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../css/override.css'
import '../css/home.css'
import { MdDashboard, MdHome, MdPlayLesson, MdTableRows } from "react-icons/md";

export default class Home extends React.Component {
    state = {
        user: undefined,
        isSuccess: false,
        isFirstTime: false,
    };

    componentDidMount() {
        document.title = 'Mockbest - Home';
        Axios.defaults.withCredentials = true;

        Axios.get(mode === 0 ? "http://localhost:3001/online-examination/api/login" : "https://examination.mockbest.com/online-examination/api/login").then((response) => {

            if (response.data.loggedIn == true) {
                console.log(response.data.user)
                //setLoginStatus(true);
                //window.location = 'https://mockbest.com?success=1';
                this.setState({ user: response.data.user[0] }) //Please verify TAG: 0
            }
        });

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.get("c") == "0") {
            this.setState({ isSuccess: true })
        }
        if (urlParams.get("c") == "1") {
            this.setState({ isFirstTime: true })
        }
    }

    logOut() {
        function get_cookie(name) {
            return document.cookie.split(';').some(c => {
                return c.trim().startsWith(name + '=');
            });
        }

        function delete_cookie(name, path, domain) {
            if (get_cookie(name)) {
                document.cookie = name + "=" +
                    ((path) ? ";path=" + path : "") +
                    ((domain) ? ";domain=" + domain : "") +
                    ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
            }
        }

        delete_cookie('userId', '/', 'localhost');
        window.location.reload();
    }

    render() {
        console.log(this.state)
        return (
            <div style={{ height: '100%', background: 'white' }}>
                <Navbar />

                <div className="col">
                    <Carousel renderArrowNext={() => { }} renderArrowPrev={() => { }} showThumbs={false}>
                        <div style={{ background: 'white', paddingLeft: 20 }}>
                            <div class="row container">
                                <div class="col-3">
                                    <img src="/graphics/c-thesis-rafiki.png" />
                                </div>
                                <div class="col text-hero pt-3">
                                    <h1>{this.state.user != null ? `Welcome back, ${this.state.user.displayname.split(' ')[0]}!` : "Start learning with us!"}</h1>
                                    <div className="mt-3">
                                        <h3>At vero eos et accusamus et iusto odio dignissimos ducimus. </h3>
                                        <h2><MdPlayLesson /> Deleniti atque corrupti quos dolores.</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <img src="/graphics/c-thesis-rafiki.png" />
                        </div>
                        <div>
                            <img src="/graphics/c-thesis-rafiki.png" />
                        </div>
                    </Carousel>
                </div>
            </div>
        )
    }
}