const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "mysql",
    port: 3306,
    user: "ssd_user",
    password: "ssd_password",
    database: "ssd_database"
});

module.exports = pool;
