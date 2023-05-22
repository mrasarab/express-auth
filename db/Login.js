require("dotenv").config();

var mysql = require("mysql");
const crypto = require("crypto");
const { HOST, USER, PASSWORD, DATABASE } = process.env;

// var conn = mysql.createConnection({
//   host: HOST,
//   user: USER,
//   password: PASSWORD,
//   database: DATABASE,
// });

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

    return res.status(200).json({ message: `Welcome, user: ${email}!` });
  });
};

module.exports = UserAuth;

