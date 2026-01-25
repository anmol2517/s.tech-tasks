const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Scar2511@#',
  database: 'student_db'
});

module.exports = db;
