const express = require('express');
const app = express();
const cricket = require('./sportsApis/cricket');
const bodyParser = require('body-parser');
const session = require('express-session');

app.use(session({secret: "lulz"}));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/auth', require('./auth/authRouter.js'));


app.get('/', function(req, res){
    cricket.getData(function(data){
        res.send(data);
    });
});

app.get('/home', function(req, res){
    res.send("Succesfully logged in!");
});

app.get("/fail", function(req, res){
    res.send("Login failed :(");
});

const server = app.listen(3000, function(){
    console.log("Server started...");
});