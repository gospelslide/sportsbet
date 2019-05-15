const db = require('../utils/dbUtils');

var getPredictionHistoryForUser = function(req, res) {
    var userId = 8;
    db.queryDb("SELECT m.description, m.series, m.team1_id, m.team2_id, m.`result`, m.mom_player_id, CAST(p.correct as CHARACTER) as correct, p.reward FROM users u INNER JOIN prediction_user_mapping pu \
    ON u.id = pu.user_id \
    INNER JOIN predictions p \
    ON p.id = pu.prediction_id \
    INNER JOIN matches m \
    ON m.id = p.match_id \
    WHERE u.id = 8 AND p.processed = 1 \
    ORDER BY p.created_timestamp DESC;", function(err, results) {
        if (err || results.length == 0) return res.send({});
        return res.send(results);
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