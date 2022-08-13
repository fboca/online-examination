import Axios from "axios";
import React from "react";
import mode from '../mode';

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
                //setLoginStatus(true);
                //window.location = 'https://mockbest.com?success=1';
                this.setState({ user: response.data.user[0] })
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
            <div>
                <p>Mockbest examination</p>
                {(this.state.user != null) ? (
                    <div>
                        <p>You are logged in as {this.state.user.displayname} ({this.state.user.email})</p>
                        {this.state.isFirstTime ? (<p>You are logging in for the first time!</p>) : (<></>)}
                        {this.state.isSuccess ? (<p>Welcome back!</p>) : (<></>)}
                        <button onClick={() => this.logOut()}>Log out</button>
                    </div>
                ) : (
                    <>
                        <p>You are not logged in.</p>
                        <button onClick={() => window.location = "/register"}>Create an account</button>
                    </>
                )}
            </div>
        )
    }
}