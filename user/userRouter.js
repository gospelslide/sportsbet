const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./userController');
const redis = require('../utils/redisUtils');

router.get('/history', controller.getPredictionHistoryForUser);
router.get('/leaderboard', controller.getAllTimeLeaderboard);

module.exports = router;