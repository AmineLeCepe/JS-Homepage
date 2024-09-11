import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

let currentUser = "";

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
app.post("/login", (req, res) => {
    console.log(req.body);
});

// Server start
app.listen(port, () => {
    console.log("Server started on port " + port);
});
