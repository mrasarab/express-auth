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

const UserDelete = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }

  const hashed_password = createHash(password);
  const email_find = "SELECT * FROM users WHERE email = ?";

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

    const delete_query = "DELETE FROM users WHERE email = ?";
    conn.query(delete_query, [email], function (error) {
      if (error) {
        return res
          .status(500)
          .json({ message: "An error occurred. Please try again later." });
      }

      return res.status(200).json({
        message: `Your account was deleted successfully, user: ${email}!`,
      });
    });
  });
};

module.exports = UserDelete;
