var mysql = require("mysql");
require("dotenv").config();
const crypto = require("crypto");


const HOST = process.env.HOST;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const DATABASE = process.env.DATABASE;

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




const check_DB = {
  connect: async () => {
    try {
      await new Promise((resolve, reject) => {
        conn.connect((err) => {
          if (err) reject(err);
          console.log("We are connected to the MySQL server!");
          resolve();
        });
      });

      const createDatabaseQuery = "CREATE DATABASE IF NOT EXISTS users";
      await conn.query(createDatabaseQuery);
      console.log("Database created!");

      const createTableQuery =
        "CREATE TABLE IF NOT EXISTS users ( email VARCHAR(255), password VARCHAR(255))";
      await conn.query(createTableQuery);
      console.log("Table created!");
    } catch (error) {
      handleError(error);
    }
  },
};

function handleError(error) {
  console.error("An error occurred:", error);
  throw error;
}

module.exports = check_DB;
