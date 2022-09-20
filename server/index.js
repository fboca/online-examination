const express = require('express');
const mysql = require("mysql");
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const CLIENT_ID = "95619042713-f74ei4ar78dk9aina2fpg1vo4oop1n94.apps.googleusercontent.com";
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
var nodemailer = require('nodemailer');

const production = false;

function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

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

const users = [];
const saltRounds = 10
const app = express();

if (production) {
    app.use(
        cors({
            origin: ["https://examination.mockbest.com"],
            methods: ["GET", "POST"],
            credentials: true,
        })
    );
} else {
    app.use(
        cors({
            origin: ["http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true,
        })
    );
}
app.use(express.json());
//for production
//if (!production) { //Remove the ! sign after please
//    app.use(cors({ credentials: true, origin: "https://app.mockbest.com", //methods: ['GET', 'POST'] }));
//} else app.use(cors({ credentials: true, origin: "http://localhost:3000", //methods: ['GET', 'POST'] }));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressSession({
    key: "userId",
    secret: "j7Z5KezKFnd6NHiHR6VE",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(253402300000000) // Approximately Friday, 31 Dec 9999 23:59:59 GMT
    }
}))

let db = [];
if (production) {
    db = mysql.createConnection({
        user: "mockbest_examination",
        host: "localhost",
        password: "BTLzBfJ7n5eDTtV",
        database: "mockbest_examination"
    });
}
else {
    db = mysql.createConnection({
        user: "root", //mockbest_examination
        host: "localhost",
        password: "R5PMQXULWRHYDf8c", //BTLzBfJ7n5eDTtV
        database: "examination_platform" //mockbest_examination
    });
}

let resetQueue = [];

app.post('/online-examination/api/google-login', async (req, res) => {
    //verifying token with hoohle api and requesting user data
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    console.log(payload);
    id = makeid(50);
    //verifying user status and creating an account if needed
    let isError = "";
    db.query(
        "SELECT * FROM users WHERE email = ?",
        payload.email,
        (err, result) => {
            if (err) {
                console.log(err)
            }

            if (result) {
                if (result.length > 0) {
                    console.log('There is another account associated with this email', result[0].login_type == 1);

                    let user = [userid, payload.email, null, payload.name, payload.picture, null, null, 0, currentTimeStamp(), null, null, 1, 1];
                    let userff = {
                        bio: null,
                        created: currentTimeStamp(),
                        displayname: payload.name,
                        email: payload.email,
                        last_logged_in: null,
                        last_updated: null,
                        location: null,
                        login_type: 1,
                        newsletter: 1,
                        package: 0,
                        password: null,
                        profile_picture: payload.picture,
                        userid: userid
                    }

                    if (result[0].login_type == 1) {

                        req.session.user = result
                        console.log(req.session.user)

                        res.writeHead(302, {
                            'Location': production ? 'https://app.mockbest.com/' : 'http://localhost:3000'
                        });
                        res.end();

                        //Log the login time.
                        db.query(
                            "UPDATE `examination_platform`.`users` SET `last_logged_in` = ? WHERE (`email` = '" + payload.email + "');", currentTimeStamp(),
                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                    isError = err.message;
                                }
                            }
                        )
                    } else {
                        res.writeHead(302, {
                            'Location': production ? 'https://app.mockbest.com/login?id=100' : 'http://localhost:3000/login?id=100'
                        });
                        res.end();
                    }
                } else {
                    console.log('There is no account associated with this email');

                    let upass = makeid(50);
                    let user = [userid, payload.email, upass, payload.name, payload.picture, null, null, 0, currentTimeStamp(), null, null, 1, 1];
                    let userff = {
                        bio: null,
                        created: currentTimeStamp(),
                        displayname: payload.name,
                        email: payload.email,
                        last_logged_in: null,
                        last_updated: null,
                        location: null,
                        login_type: 1,
                        newsletter: 1,
                        package: 0,
                        password: upass,
                        profile_picture: payload.picture,
                        userid: userid
                    }

                    db.query(
                        "INSERT INTO users (userid, email, password, displayname, profile_picture, bio, location, package, created, last_logged_in, last_updated, newsletter, login_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", user,
                        (err, result) => {
                            if (err) {
                                console.log(err);
                                isError = err.message;
                            }

                            if (result) {
                                //logging in the user and sending the request
                                req.session.user = [userff]
                                console.log(req.session.user)

                                res.writeHead(302, {
                                    'Location': production ? 'https://app.mockbest.com/' : 'http://localhost:3000'
                                });
                                res.end();

                                //Log the login time.
                                db.query(
                                    "UPDATE `examination_platform`.`users` SET `last_logged_in` = ? WHERE (`email` = '" + payload.email + "');", currentTimeStamp(),
                                    (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            isError = err.message;
                                        }
                                    }
                                )
                            }
                        }
                    )

                }
            } else {
                console.log('There is no account asociated with this email');

            }
        }
    );
});



app.post("/online-examination/api/register", (req, res) => {
    const username = req.body.username;
    var isError = "";
    let userid = makeid(20)

    console.log(username, req.body.password)

    try {
        db.query(
            "SELECT * FROM users WHERE email = ?",
            username,
            (err, result) => {
                if (err) {
                    console.log(err)
                }

                if (result) { // Cannot read result undefined
                    if (result.length > 0) {
                        isError = "There is another account asociated with this email.";
                    } else {
                        bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                            if (err) {
                                console.log(err);
                                isError = err.message;
                            }
                            db.query(
                                "INSERT INTO users (userid, email, password, displayname, profile_picture, bio, location, package, created, last_logged_in, last_updated, newsletter, login_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [userid, username, hash, req.body.displayName, null, null, null, 1, currentTimeStamp(), null, null, req.body.newsletterAllowed ? 1 : 0, 0],
                                (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        isError = err.message;
                                    }
                                }
                            )
                        })
                    }
                }
            }
        );
    } catch (e) {
        console.log(err)
    }

    if (isError != "") {
        res.send({ error: true, message: err })
    } else res.send({ error: false });
    console.log(req.body)
})

app.get("/online-examination/api/login", (req, res) => {
    console.log(req.session)
    //resetQueue.push({ email: 'bordehai123@gmail.com', code: 546789, created: Date.now() }) // do not forget to remove
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/online-examination/api/reset-password/verification", (req, res) => {
    //User state
    let user = {
        email: req.body.to,
        code: null,
        enteredCode: req.body.code,
        newpassword: req.body.password,
        successState: false,
        error: '',
        exists: false,
    }

    if (resetQueue != []) for (var i = 0; i < resetQueue.length; i++) {
        if (resetQueue[i].email === user.email) {
            user.exists = true;
        }
    }

    if (!user.exists) {
        user.error = "The code has been already used or it was never requested.";
        res.send({ success: user.successState, error: user.error });
    }

    console.log(resetQueue, !user.exists)

    //Gathering data / updating state
    if (user.exists) for (var i = 0; i < resetQueue.length; i++) {
        if (resetQueue[i].email === user.email) {
            var diff = Math.abs(Date.now() - resetQueue[i].created);
            var minutes = Math.floor((diff / 1000) / 60);

            console.log(minutes)
            if (minutes < 30) {
                user.code = resetQueue[i].code;
                console.log(user.code, user.enteredCode)
                if (user.code == user.enteredCode) {
                    //UPDATE `examination_platform`.`users` SET `password` = 'proba', `last_updated` = '2022-09-16 17:03:18' WHERE (`userid` = '108350455963852874378');

                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        if (err) {
                            console.log(err);
                            isError = err.message;
                            //res.send({ success: false, error: 'Unexpected error occured.' });
                            user.error = 'Unexpected error occured.'
                            res.send({ success: user.successState, error: user.error });
                        }
                        db.query(
                            //"UPDATE `examination_platform`.`users` SET `password` = '" + hash + "', `last_updated` = '" + currentTimeStamp() + "," + "' WHERE (`email` = '" + user.email + "');",
                            "UPDATE `examination_platform`.`users` SET `password` = '" + hash + "', `last_updated` = '" + currentTimeStamp() + "', `login_type` = '0' WHERE (`email` = '" + user.email + "')",

                            (err, result) => {
                                if (err) {
                                    console.log(err);
                                    isError = err.message;
                                    user.error = 'Unexpected error occured.'
                                    res.send({ success: user.successState, error: user.error });
                                } else {
                                    user.successState = true;
                                    user.error = '';
                                    resetQueue.splice(i - 1, 1);
                                    res.send({ success: user.successState, error: user.error, resetQueue, i });
                                }
                            }
                        )
                    })
                } else { user.error = "Verification code is invalid."; res.send({ success: user.successState, error: user.error }); }
            } else {
                user.error = "Request timed out. The code is valid only for 30 minutes.";
                resetQueue.splice(i - 1, 1);
                res.send({ success: user.successState, error: user.error });
                //resetQueue = resetQueue.slice(0, i).concat(resetQueue.slice(-i));
            }
        }
    }
}
);

app.post("/online-examination/api/reset-password", (req, res) => {
    let transportQueued = () => {
        //Adding a delay so the action cannot be interpreted - security concerns
        setTimeout(() => res.send({ success: true }), 2500)
    }

    let transportNotQueued = () => {
        //Prepairing the email for sending
        var mailOptions = {
            from: 'verification@mockbest.com',
            to: user.email,
            subject: 'Reset your password',
            text: `Hi ${user.displayname}, \n your mockbest verification code is: ` + user.code,
            html: `Hi ${user.displayname}, \n your mockbest verification code is: ` + user.code
        };

        var transporter = nodemailer.createTransport({
            host: "mail.mockbest.com",
            port: 465,
            secure: true,
            auth: {
                user: "verification@mockbest.com",
                pass: "BTLzBfJ7n5eDTtV",
            },
        });

        fs.readFile('./templates/resetpassword.html', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                if (data != "") {
                    data = data.replace('{{displayname}}', user.displayname)
                    data = data.replace('{{code}}', user.code)
                    mailOptions.html = data;

                    //Sending email
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email verification sent: ' + info.response);
                            resetQueue.push({ email: user.email, code: user.code, created: Date.now() })
                            res.send({ success: true })
                        }
                    });
                }
            }
        });
    }

    //User state
    let user = {
        displayname: '',
        email: req.body.to,
        exists: false,
        wasQueued: false,
        code: makeid(10)
    }

    //Gathering data / updating state
    for (var i = 0; i < resetQueue.length; i++) {
        if (resetQueue[i].email === user.email) {
            var diff = Math.abs(Date.now() - resetQueue[i].created);
            var minutes = Math.floor((diff / 1000) / 60);
            console.log(minutes);

            if (minutes < 30) {
                user.wasQueued = true;
                user.code = resetQueue[i].code;
            } else {
                //Remove entity from queue array
                resetQueue.splice(i - 1, 1);
            }
        }
    }
    if (!user.wasQueued) {
        db.query(
            "SELECT * FROM users WHERE email = ?",
            user.email,
            (err, result) => {
                if (err) {
                    console.log(err)
                }

                if (result) {
                    if (result.length > 0) {
                        console.log(result)
                        user.displayname = result[0].displayname;
                        user.exists = true;
                    }
                    //Done
                    if (!user.exists) transportQueued();
                    else transportNotQueued();
                }
            }
        )
    } else transportQueued()
});

app.get("/online-examination/api/logout", (req, res) => {
    console.log(req.session)
    if (req.session.user) {
        req.session.user = null;
        res.send({ loggedIn: false });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post("/online-examination/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE email = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }

            if (result) {
                if (result.length > 0) {
                    bcrypt.compare(password, result[0].password, (error, response) => {
                        if (response) {
                            req.session.user = result
                            console.log(req.session.user)
                            res.send(result);

                            //Log the login time.
                            db.query(
                                "UPDATE `examination_platform`.`users` SET `last_logged_in` = ? WHERE (`email` = '" + req.body.username + "');", currentTimeStamp(),
                                (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        isError = err.message;
                                    }
                                }
                            )
                        } else {
                            res.send({ error: true, message: "You entered the wrong password." })
                        }
                    })
                } else {
                    res.send({ error: true, message: "There is no account associated with " + req.body.username })
                }
            }
        }
    )
});

app.listen(production ? 80 : 3001, () => {
    console.log("Mockbest examination backend - process started", currentTimeStamp())
    console.log("Server is running on port 3001");
})