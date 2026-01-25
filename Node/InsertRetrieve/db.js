const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Scar2511@#',
  database: 'bus_booking_system'
});

db.connect();

module.exports = db;
