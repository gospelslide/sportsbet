const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./predictionsController');

// router.get('/predict', function(req, res){
// });

router.get('/teams', controller.getTeamsForMatch);
router.get('/players', controller.getPlayersForMatch);
router.post('/recordPrediction', controller.recordPrediction);

module.exports = router;