const express = require('express');
const crypto = require('crypto');
const controller = require('./authController');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');

router.get('/login', function(req, res) {
    return res.sendFile(fileUtil.getStaticFilePath('login.html'));
});

router.get('/signup', function(req, res){
    return res.sendFile(fileUtil.getStaticFilePath('register.html'));
});

router.get('/logout', controller.logoutUser);
router.post('/register', controller.registerNewUser);
router.post('/authenticate', controller.authenticate);

//export this router to use in our index.js
module.exports = router;