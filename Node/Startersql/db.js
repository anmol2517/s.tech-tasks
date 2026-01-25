const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Scar2511@#',
  database: 'testdb1'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
