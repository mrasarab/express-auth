const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const SignUp = require("./db/SignUp");
const DelUser = require("./db/DelUser");
const Login = require("./db/Login");
const CheckDB = require("./db/CheckDB");
// const verifyJWT = require("./jwt");
const cookieParser = require("cookie-parser");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", async (req, res) => {
  await CheckDB.connect();
  res
    .status(200)
    .json("Welcome to Sample Website for user managing with cookies...");
});

app.post("/SignUp", async (req, res) => {
  await SignUp(req, res);
});

app.get("/Login", (req, res) => {
  Login(req, res);
});

app.post("/DelUser", async (req, res) => {
  await DelUser(req, res);
});

app.get("/shopping", verifyJWT, (req, res) => {
  res.json({'welcome to your account user : ':req.email.user});
});

function verifyJWT(req, res, next) {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.email = email;
    next();
  });
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
