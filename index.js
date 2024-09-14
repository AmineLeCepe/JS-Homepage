import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";
import env from "dotenv";


const app = express();
const port = process.env.PORT || 3000;

env.config();

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
            if (result.rows[0].password == submittedPassword) {
                res.render("index.ejs", {
                    currentUser: result.rows[0].username,
                });
            } else {
                res.render("login.ejs", {
                    errorMessage: "Login failed: passwords do not match"
                });
                console.log("Login failed: passwords do not match");
            }
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

// Server start
app.listen(port, () => {
    console.log("Server started on port " + port);
});
