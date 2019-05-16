const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./userController');
const redis = require('../utils/redisUtils');

router.get('/predictionHistory', function(req, res) {
    return res.sendFile(fileUtil.getStaticFilePath('user_history.html'));
});
router.get('/history', controller.getPredictionHistoryForUser);
router.get('/leaderboard', controller.getAllTimeLeaderboard);

module.exports = router;