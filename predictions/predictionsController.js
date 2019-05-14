const db = require('../utils/dbUtils');

var recordPrediction = function(req, res) {
    var type = req.body.type;
    var entityid = req.body.momid || req.body.teamid;
    var matchid = req.body.matchid;
    checkIfPredictionExists(type, entityid, matchid, function(results) {
        if (results && results.length > 0) {
            insertUserPrediction(req.session.user, results[0]["id"], function(err, results) {
                if (!err) return res.send("Successfully added your prediction!");
            });
        }
        else {
            console.log("should not be printed");
            insertPrediction(type, entityid, matchid, function(err, results, predictionInsertId) {
                if (!err && !!predictionInsertId) {
                    insertUserPrediction(req.session.user, predictionInsertId, function(err, results) {
                        if (!err) return res.send("Successfully added your prediction!");
                    });
                }
            });
        }
    });
}

var checkIfPredictionExists = function(type, entityid, match_id, callback) {
    // console.log("SELECT * FROM predictions where type = '" + type + "' and entity_id = " + entityid + " and processed != 1;");
    db.queryDb("SELECT * FROM predictions where type = '" + type + "' and entity_id = " + entityid + " and match_id = " + match_id, 
    function(err, results) {
        if (err || results.length == 0) return callback(false);
        return callback(results);
    });
}

var insertPrediction = function(type, entity, matchid, callback) {
    reward = (type == "mom") ? 500 : 200;
    db.queryDb(db.prepareInsertQuery("predictions", ["type", "entity_id", "match_id", "processed", "reward"], [type, entity, matchid, 0, reward]), callback);
}

var insertUserPrediction = function(userid, predictionid, callback) {
    db.queryDb(db.prepareInsertQuery("prediction_user_mapping", ["prediction_id", "user_id"], [predictionid, userid]), callback);
}

var getTeamsForMatch = function(req, res) {
    var matchid = req.query.matchid;
    db.queryDb("SELECT m.id, t1.id as team1_id, t1.name as team1_name, t2.id as team2_id, t2.name as team2_name FROM matches m INNER JOIN teams t1 on (t1.id = m.team1_id) INNER JOIN teams t2 on (t2.id = m.team2_id) WHERE m.id = " + matchid, function(err, results){
        return res.send(JSON.stringify(results[0]));
    });
}

var getPlayersForMatch = function(req, res) {
    var matchid = req.query.matchid;
    db.queryDb("SELECT id, team1_players, team2_players FROM matches WHERE id = " + matchid, function(err, results){
        if (err) return res.send("Failed");
        var team1 = JSON.parse(results[0]["team1_players"]);
        var team2 = JSON.parse(results[0]["team2_players"]);
        var playerList = JSON.stringify(team1.concat(team2));
        playerList = playerList.replace("[", "(").replace("]", ")");
        var query = "SELECT * FROM players WHERE id in " + playerList;
        db.queryDb(query, function(err, results) {
            console.log(err);
            if (err) return res.send("Failed");
            return res.send(results);
        });
    });
}

var getAllPredictionsForUser = function(req, res) {
    db.queryDb("SELECT")
}

module.exports = {
    recordPrediction: recordPrediction,
    getTeamsForMatch: getTeamsForMatch,
    getPlayersForMatch: getPlayersForMatch
}