const mysql = require("mysql2/promise")

module.exports = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Scar2511@#", // sql password
  database: "cricket_careers"
})


