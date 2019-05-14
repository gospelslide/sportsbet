const crypto = require('crypto');
const db = require('../utils/dbUtils');

var generateRandomString = function(length) {
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
        if (err || results.length == 0) res.redirect('/');
        else {
            var encPass = sha512(password, results[0]['salt'])['passwordHash'];
            if (encPass == results[0]['password']) {
                req.session.user = user;
                return res.redirect("/home");
            }
            else {
                return res.send("Invalid credentials!");
            }
        }
    });
}

var registerNewUser = function(req, res) {
    var newUser = req.body.username;
    var pass = req.body.password;
    var salt = generateRandomString(10);
    var encPass = sha512(pass, salt).passwordHash;
    db.queryDb(db.prepareInsertQuery("users", ["username", "password", "salt"], [newUser, encPass, salt]), function(err, result) {
        if (err)
            return res.redirect("/fail");
        req.session.user = newUser;
        return res.redirect("/home");
    });
}

var isLoggedIn = function(req, res) {
    if (!req.session.user) return false;
    else return true;
}

module.exports = {
    generateRandomString: generateRandomString,
    isLoggedIn: isLoggedIn,
    registerNewUser: registerNewUser,
    authenticate: authenticate
}