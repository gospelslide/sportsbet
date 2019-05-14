const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'zomato@2019',
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

var prepareInsertQuery = function(table, columns, values) {
    var insert = "INSERT INTO " + table + " (";
    for (var i in columns) {
        insert += (columns[i]);
        if (i < columns.length-1)
            insert += ",";
    }
    insert += ") VALUES (";
    for (var i in values) {
        insert += ("'" + values[i] + "'");
        if (i < values.length-1)
            insert += ",";
    }
    insert += ");";
    return insert;
}

module.exports = {
    queryDb: queryDb,
    prepareInsertQuery: prepareInsertQuery
}