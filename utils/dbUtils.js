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
            if (typeof callback !== "function") return;
            if (err) callback(err, false);
            else callback(false, results, results.insertId);
        });
    }
    catch (e) {
        callback(e, false);
    }
};

var prepareInsertQuery = function(table, columns, values, ignore) {
    if (!ignore)
        var insert = "INSERT INTO " + table + " (";
    else
        var insert = "INSERT IGNORE INTO " + table + " (";
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

var prepareBulkInsertQuery = function(table, columns, values, ignore) {
    if (!ignore)
        var insert = "INSERT INTO " + table + " (";
    else
        var insert = "INSERT IGNORE INTO " + table + " (";
    for (var i in columns) {
        insert += (columns[i]);
        if (i < columns.length-1)
            insert += ",";
    }
    insert += ") VALUES ";
    for (var row in values) {
        insert += "("
        for (var i in values[row]) {
            insert += ("'" + values[row][i] + "'");
            if (i < values[row].length-1)
                insert += ",";
        }
        insert += ")";
        if (row < values.length-1)
            insert += ", "
    }
    insert += ";";
    return insert;
}

// console.log(bulkInsert("users", ["username", "password"], [["a", "b"], ["c", "d"], ["d", "e"]], true));

module.exports = {
    queryDb: queryDb,
    prepareInsertQuery: prepareInsertQuery,
    prepareBulkInsertQuery: prepareBulkInsertQuery
}