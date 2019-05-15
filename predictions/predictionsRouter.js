const express = require('express');
const router = express.Router();
const fileUtil = require('../utils/fileUtils');
const controller = require('./predictionsController');

// router.get('/predict', function(req, res){
// });

router.get('/teams', controller.getTeamsForMatch);
router.get('/teamPredict', function(req, res){
    return res.sendFile(fileUtil.getStaticFilePath('predict-team-form.html'));
});
router.get('/playerPredict', function(req, res) {
    return res.sendFile(fileUtil.getStaticFilePath('predict-mom-form.html'));
})
router.get('/players', controller.getPlayersForMatch);
router.post('/recordPrediction', controller.recordPrediction);

module.exports = router;