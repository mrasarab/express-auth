const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
process.env.REFRESH_TOKEN_SECRET;

const generateJWT = (req, res) => {
  const email = req.body;
  const token = jwt.sign(email, ACCESS_TOKEN_SECRET, { expiresIn: "1800s" });
  console.log(token);
  res.cookie("token", token, { httpOnly: true });
  
};

// function AuthJWT(token) {

// }

module.exports = generateJWT;
