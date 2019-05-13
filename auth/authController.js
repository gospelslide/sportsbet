const crypto = require('crypto');
const db = require('../utils/dbUtils');

var genRandomString = function(length) {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

var authenticate = function(req, res) {
    var user = req.body.username;
    var password = req.body.password;
    db.queryDb("SELECT username, password, salt FROM users WHERE username = " + "'" + user + "'", function(err, results){
        if (err) res.redirect('/');
        else {
            console.log("got");
        }
    });
    var generatedCurrPassword = sha512(password, )
    if (password == sha512())
    res.send(user);
}

var isLoggedIn = function(req, res) {
    if (!req.session.user) return false;
    else return true;
}

module.exports = {
    genRandomString: genRandomString,
    isLoggedIn: isLoggedIn
}