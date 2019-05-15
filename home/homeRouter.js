const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./homeController');
const redis = require('../utils/redisUtils');

router.get('/getMatchData', function(req, res){
    controller.getData(function(data){
        res.send(JSON.stringify(data));
    }, false);
});

router.get('/', function(req, res){
    return res.sendFile(fileUtil.getStaticFilePath('home.html'));
});

// router.get("/redistest", function(req, res) {
//     redis.setRedisKey("vishal", "sheth", 100000, function() {
//         redis.getRedisKey("vishal", function(err, val){
//             return res.send(val);
//         })
//     });
// });

module.exports = router;