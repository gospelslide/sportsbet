var express = require('express');
var crypto = require('crypto');
var controller = require('./authController');
var router = express.Router();

router.post('/', function(req, res){
    res.redirect('/');
});

//export this router to use in our index.js
module.exports = router;