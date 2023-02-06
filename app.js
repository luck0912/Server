const express = require("express");
const dotenv = require("dotenv");
const app = express();

dotenv.config({ path: "./config.env" });
require("./DB/conn");
// const User = require('./Model/userSchema')

app.use(express.json());
// We link the router files to make our route easy
app.use(require("./router/auth"));

const PORT = process.env.PORT;

// middleware
const middleware = (req, res, next) => {
  console.log("Hello Middleware");
  next();
};

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.get("/about", middleware, (req, res) => {
  res.send("About ME");
});

app.get("/contact", (req, res) => {
  res.send("Contact Us");
});
app.get("/signin", (req, res) => {
  res.send("Log in");
});

app.get("/signup", (req, res) => {
  res.send("Register page");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} `);
});
