const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const auth = require('./auth/authController');

app.use(session({secret: "lulz"}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', require('./auth/authRouter.js'));
app.use('/home', require('./home/homeRouter.js'));
app.use('/', function(req, res) {
    return res.send("<h2>Welcome to Sportsbet!</h2>");
});

const server = app.listen(3000, function(){
    console.log("Server started...");
});