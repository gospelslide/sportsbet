const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const auth = require('./auth/authController');
const fileUtil = require('./utils/fileUtils');

app.use(session({secret: "lulz"}));

// add auth to all routes after testing
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', require('./auth/authRouter'));
app.use('/home', auth.isLoggedIn, require('./home/homeRouter'));
app.use('/predict', auth.isLoggedIn, require('./predictions/predictionsRouter'));
app.use('/user', auth.isLoggedIn, require('./user/userRouter'));
app.use('/', function(req, res) {
    return res.sendFile(fileUtil.getStaticFilePath('first.html'));
});

const server = app.listen(3000, function(){
    console.log("Server started...");
});