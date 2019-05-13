const express = require('express');
const app = express();

app.use('/auth', require('./auth/authRouter.js'));


app.get('/', function(req, res){
    res.send("Hello world!");
});

app.get('/home', function(req, res){
    res.send("Succesfully logged in!");
});

const server = app.listen(3000, function(){
    console.log("Server started...");
});