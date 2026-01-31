const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Pranjal@123",
  database: "task_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
