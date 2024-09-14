import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import e from "express";

env.config();

const app = express();
const port = process.env.PORT;
const saltRounds = 10;

// Setting up connection with database
const db = new pg.Client({
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
});

// Connecting to database
db.connect();

// Functions

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.static('public'));

// Loads the homepage
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Loads the login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Loads the register page

app.get("/register", (req, res) => {
    res.render("register.ejs");
});


// Intercepts POST requests for user login,
// Request body: { username: "", password: "" }
app.post("/login", async (req, res) => {
    const submittedUser = req.body.username;
    const submittedPassword = req.body.password;

    try {
        const result = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [submittedUser]
        );
        if (result.rows.length > 0) {
            const dbHashedPassword = result.rows[0].password;
            bcrypt.compare(submittedPassword, dbHashedPassword, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result) {
                        console.log("Login successful");
                        res.render("index.ejs", {
                            currentUser: submittedUser
                        });
                    } else {
                        console.log("Login failed: passwords do not match")
                        res.render("login.ejs", {
                            errorMessage: "Login failed: passwords do not match",
                        });
                    }
                }
            });
        } else {
            res.render("login.ejs", {
                errorMessage: "Login failed: user not found"
            });
            console.log("Login failed: user not found");
        }
    } catch (err) {
        console.error(err);
    };

});

// Intercepts POST request for user registration,
// Request body: { username: "", password: "", passwordConfirm: "" }

app.post("/register", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [req.body.username]
        );
        if (result.rows.length > 0) {
            res.render("register.ejs", {
                errorMessage: "Register failed: user already exists"
            });
            console.log("Register failed: user alraedy exists");
        } else {
            if (req.body.password === req.body.passwordConfirm) {
                bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
                    if (err) {
                        console.error(err);
                    }
                    const result = await db.query(
                        "INSERT INTO users (username, password) VALUES ($1, $2)",
                        [req.body.username, hash]
                    );
                    console.log(`Result: ${result}`);
                    console.log("Registration complete");
                    res.redirect("/");
                });
            } else {
                res.render("register.ejs", {
                    errorMessage: "Register failed: passwords do not match"
                });
                console.log("Register failed: passwords do not match");
            }
        }
    } catch (err) {
        console.error(err);
        res.redirect("/register");
    }
})

// Server start
app.listen(port, () => {
    console.log("Server started on port " + port);
});
