const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'toor',
    database : 'sportsbet',
    insecureAuth: true
});

connection.connect();

var queryDb = function(q, callback) {
    try {
        connection.query(q, function(err, results){
            if (err) callback(err, false);
            else callback(false, results);
        });
    }
    catch (e) {
        callback(e, false);
    }
};

module.exports = {
    queryDb: queryDb
}