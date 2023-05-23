var mysql = require("mysql");
require("dotenv").config();
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

const NewUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  const email_check = "SELECT * FROM users WHERE email = ?";
  conn.query(email_check, [email], (error, emailCheckResult) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "An error occurred. Please try again later." });
    }

    if (emailCheckResult.length > 0) {
      return res.status(400).json({
        message:
          "This email is already in use. Please choose a different email!",
      });
    }

    const hashed_password = createHash(password);
    const sql_insert = "INSERT INTO users (email, password) VALUES (?, ?)";

    conn.query(sql_insert, [email, hashed_password], (error) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "An error occurred. Please try again later." });
      }

      return res.status(200).json({ message: "User created successfully!" });
    });
  });
};

module.exports = NewUser;
