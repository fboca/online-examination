const express = require('express');
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require('bcrypt');
//const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');

const production = false;

function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
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

//dotenv.config();
//const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const users = [];
const saltRounds = 10
const app = express();

app.use(express.json());
//for production
if (production) {
    app.use(cors({ credentials: true, origin: "https://app.mockbest.com", methods: ['GET', 'POST'] }));
} else app.use(cors({ credentials: true, origin: "http://localhost:3000", methods: ['GET', 'POST'] }));
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

app.post('/online-examination/api/google-login', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "95619042713-f74ei4ar78dk9aina2fpg1vo4oop1n94.apps.googleusercontent.com"
    });
    const { name, email, picture } = ticket.getPayload();
    upsert(users, { name, email, picture });
    res.status(201);
    //res.json({ name, email, picture });
    console.log(name, email, picture)
});


app.post("/online-examination/api/register", (req, res) => {
    const username = req.body.username;
    var isError = "";

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
                                "INSERT INTO users (userid, email, password, displayname, profile_picture, bio, location, package, created, last_logged_in, last_updated, newsletter) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [0, username, hash, req.body.displayName, null, null, null, 1, currentTimeStamp(), null, null, req.body.newsletterAllowed ? 1 : 0],
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
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
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