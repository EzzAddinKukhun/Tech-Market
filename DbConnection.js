const mysql = require('mysql');

const mysqlConnection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root123',
        database: 'tech'
    }
);

mysqlConnection.connect((err) => {
    if (!err) {
        console.log("CONNECTION SUCCESS")

    }
    else {
        console.log("CONNECTION FAILED")
        console.log(err)
    }
});



module.exports = mysqlConnection