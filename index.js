import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import pg from "pg";

const app = express();
const port = process.env.PORT || 3000;

// Setting up connection with database
const db = new pg.Client({
    user: "postgres",
    password: "gopoop23",
    host: "localhost",
    port: 5432,
    database: "js-homepage",
});

// Connecting to database
db.connect();

// Global variables
let currentUser = "";
let submittedUser = "";
let submittedPassword = "";

// Functions

async function checkPassword() {
    const result = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [submittedUser, submittedPassword]);
    return result.rows;
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.static('public'));

// Loads the homepage
app.get("/", (req, res) => {
    res.render("index.ejs", {
        user: currentUser,
    });
});

// Loads the login page
app.get("/login", (req, res) => {
    res.render("login.ejs");
});


// Intercepts POST requests for user login,
// Request body: { username: "", password: "" }
app.post("/login", async (req, res) => {
    submittedUser = req.body.username;
    submittedPassword = req.body.password;
    console.log(await checkPassword());
});

// Server start
app.listen(port, () => {
    console.log("Server started on port " + port);
});
