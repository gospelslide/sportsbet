const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./homeController');

router.get('/', function(req, res){
    controller.getData(function(data){
        res.send(JSON.stringify(data));
    });
});

module.exports = router;