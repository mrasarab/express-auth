const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
var mysql = require("mysql");
const crypto = require("crypto");

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "05121",
  database: "users",
});

function createHash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const UserAuth = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  const hashed_password = createHash(password);
  const email_find = `SELECT * FROM users WHERE email = ?`;

  conn.connect();

  conn.query(email_find, [email], function (error, result) {
    if (error) {
      return res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: "You must first sign up!" });
    }

    if (result[0].password !== hashed_password) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
    const email = req.body.email;
    const payload = { user: email };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 60000 });
    return res
      .status(200)
      .json({
        message: `Welcome, user: ${email}! and your token is : ${accessToken}`,
      });
  });
};

module.exports = UserAuth;
