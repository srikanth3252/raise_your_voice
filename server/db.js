const mysql = require("mysql2");


console.log("HOST:", process.env.MYSQLHOST);
console.log("USER:", process.env.MYSQLUSER);
console.log("DATABASE:", process.env.MYSQLDATABASE);
console.log("PORT:", process.env.MYSQLPORT);

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected successfully");
    }
});

module.exports = db;