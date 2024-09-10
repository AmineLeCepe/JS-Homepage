import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
})


app.listen(port, () => {
    console.log("Server started on port " + port);
});
