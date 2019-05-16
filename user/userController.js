const db = require('../utils/dbUtils');

var getPredictionHistoryForUser = function(req, res) {
    var userId = req.session.user || 6;
    db.queryDb("SELECT m.description, m.series, m.team1_id, m.team2_id, m.`result`, m.mom_player_id, \
    CAST(p.correct as CHARACTER) as correct, p.reward, p.type, CAST(p.processed as CHARACTER) as processed, p.entity_id,\
    u.rewards as total_rewards FROM users u INNER JOIN prediction_user_mapping pu \
    ON u.id = pu.user_id \
    INNER JOIN predictions p \
    ON p.id = pu.prediction_id \
    INNER JOIN matches m \
    ON m.id = p.match_id \
    WHERE u.id = " + userId + " \
    ORDER BY p.created_timestamp DESC;", function(err, results) {
        if (err || results.length == 0) return res.send({});
        var teams = [];
        var moms = [];
        for (var i in results) {
            teams.push(results[i]["team1_id"]);
            teams.push(results[i]["team2_id"]);
            if (!!results[i]["mom_player_id"])
                moms.push(results[i]["mom_player_id"]);
            if (results[i]["type"] == "mom")
                moms.push(results[i]["entity_id"]);
        }
        var matchDataTasks = [];
        matchDataTasks.push(new Promise(function(resolve, reject){
            var teamids = "(" + teams.toString() + ")";
            db.queryDb("SELECT * FROM teams WHERE id in " + teamids, function(err, data){
                resolve(data);
            });
        }));
        matchDataTasks.push(new Promise(function(resolve, reject){
            players = "(" + moms.toString() + ")";
            db.queryDb("SELECT * FROM players WHERE id in " + players, function(err, data){
                resolve(data);
            });
        }));
        Promise.all(matchDataTasks).then(function(values) {
            var response = {};
            var teams = {};
            var players = {};
            for (var i in values[0]) {
                teams[values[0][i]["id"]] = values[0][i]["name"];
            }
            for (var j in values[1]) {
                players[values[1][j]["id"]] = values[1][j]["name"];
            }
            response["teams"] = teams;
            response["players"] = players;
            response["predictions"] = results;
            return res.send(response);
        });
    })
}

var getAllTimeLeaderboard = function(req, res) {
    var numrows = req.query.rows || 10;
    db.queryDb("SELECT username, rewards FROM users ORDER BY rewards DESC LIMIT " + numrows, function(err, results){
        if (err || results.length == 0) return res.send({});
        return res.send(results);
    });
}

module.exports = {
    getPredictionHistoryForUser: getPredictionHistoryForUser,
    getAllTimeLeaderboard: getAllTimeLeaderboard
}