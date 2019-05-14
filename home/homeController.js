const http = require('http');
const request = require('request');
const db = require('../utils/dbUtils');
const api = "https://www.cricbuzz.com/match-api/livematches.json";
var matches = {};


var getData = function(callback) {
    var d = new Date().getHours();
    request(api + "?day=" + d, function(err, response, body) {
        var matchData = structureData(JSON.parse(body)["matches"]);
        var dbInsertTasks = [];
        dbInsertTasks.push(new Promise(function(resolve, reject){
            insertMatchData(matchData, resolve);
        }));
        dbInsertTasks.push(new Promise(function(resolve, reject){
            insertTeamData(matchData, resolve);
        }));
        dbInsertTasks.push(new Promise(function(resolve, reject){
            insertPlayerdata(JSON.parse(body)["matches"], resolve);
        }));
        Promise.all(dbInsertTasks).then(function(values){
            console.log("All insertion tasks complete!");
            callback(matchData);
        })
    });
}

var structureData = function(matchData) {
    for (var id in matchData) {
        var currmatch = {};
        currmatch["id"] = id;
        currmatch["start"] = parseInt(matchData[id]["start_time"]);
        currmatch["end"] = parseInt(matchData[id]["end_time"]) || parseInt(matchData[id]["exp_end_time"]);
        currmatch["description"] = matchData[id]["match_desc"];
        currmatch["series"] = matchData[id]["series"]["name"];
        currmatch["team1"] = {};
        currmatch["team2"] = {};
        currmatch["team1"]["id"] = matchData[id]["team1"]["id"];
        currmatch["team1"]["name"] = matchData[id]["team1"]["name"];
        currmatch["team1"]["players"] = getPlayerObj("team1", matchData[id]);
        currmatch["team2"]["id"] = matchData[id]["team2"]["id"];
        currmatch["team2"]["name"] = matchData[id]["team2"]["name"];
        currmatch["team2"]["players"] = getPlayerObj("team2", matchData[id]);
        currmatch["winning_team_id"] = matchData[id]["winning_team_id"] || "";
        currmatch["state"] = matchData[id]["state"];
        currmatch["result"] = matchData[id]["status"];
        currmatch["mom_player_id"] = (matchData[id].hasOwnProperty("mom")) ? matchData[id]["mom"][0] : "";
        var currentTime = (new Date).getTime();
        if (currmatch["end"] >= currentTime || (currmatch["start"] - currentTime > 30*60) || currmatch["result"].length > 0)
            currmatch["bettable"] = 0;
        else
            currmatch["bettable"] = 1;
        matches[id] = currmatch;
    }
    return matches;
}

var insertMatchData = function(matchdata, callback) {
    var columns = ["id","description","series","team1_id","team2_id","state","winning_team_id","result","mom_player_id","bettable","team1_players","team2_players","start","end"];
    var values = [];
    for (var match in matchdata) {
        var currvalue = [];
        var currmatch = matchdata[match];
        var mapping = {
            "team1_id": currmatch["team1"]["id"],
            "team2_id": currmatch["team2"]["id"],
        }
        if (matchdata.hasOwnProperty(match)) {
            for (var i in columns) {
                switch (columns[i]) {
                    case "team1_id":
                    currvalue.push(currmatch["team1"]["id"]);
                    break;
                    case "team2_id":
                    currvalue.push(currmatch["team2"]["id"]);
                    break;
                    case "team1_players":
                    var player_ids = Object.keys(currmatch["team1"]["players"]);
                    currvalue.push(JSON.stringify(player_ids));
                    break;
                    case "team2_players":
                    var player_ids = Object.keys(currmatch["team2"]["players"]);
                    currvalue.push(JSON.stringify(player_ids));
                    break;
                    default:
                    currvalue.push(currmatch[columns[i]]);
                }
            }
        }
        values.push(currvalue);
    }
    if (typeof callback !== "function")
        db.queryDb(db.prepareBulkInsertQuery("matches", columns, values, true));
    else        
        db.queryDb(db.prepareBulkInsertQuery("matches", columns, values, true), callback);
}

var insertTeamData = function(data, callback) {
    var columns = ["id", "name"];
    var values = [];
    for (var id in data) {
        var value1 = [];
        value1.push(data[id]["team1"]["id"]);
        value1.push(data[id]["team1"]["name"]);
        var value2 = [];
        value2.push(data[id]["team2"]["id"]);
        value2.push(data[id]["team2"]["name"]);
        values.push(value1);
        values.push(value2);
    }
    // console.log(values);
    if (typeof callback !== "function")
        db.queryDb(db.prepareBulkInsertQuery("teams", columns, values, true));
    else        
        db.queryDb(db.prepareBulkInsertQuery("teams", columns, values, true), callback);
}

var insertPlayerdata = function(matches, callback) {
    var columns = ["id", "name"];
    var values = [];
    for (var i in matches) {
        for (var j in matches[i]["players"]) {
            var value = [];
            value.push(matches[i]["players"][j]["id"]);
            value.push(matches[i]["players"][j]["name"]);
            values.push(value);
        }
    }
    if (typeof callback !== "function")
        db.queryDb(db.prepareBulkInsertQuery("players", columns, values, true));
    else        
        db.queryDb(db.prepareBulkInsertQuery("players", columns, values, true), callback);
}

var getPlayerObj = function(team, data) {
    var playing11 = (data[team]["squad"].length == 0) ? data[team]["squad_bench"] : data[team]["squad"];
    var playerData = {};
    if (playing11.length <= 0)
        return playerData;
    for (var i in playing11) {
        var id = playing11[i];
        for (var j in data["players"]) {
            if (id == data["players"][j]["id"]) {
                playerData[id] = data["players"][j]["name"];
                break;
            }
        }
    }
    return playerData;
}

var getManOfTheMatch = function(data, mom) {
    if (mom.length <= 0)
        return "";
    var momId = mom[0];
    console.log(momId);
    if (data["team1"]["players"].hasOwnProperty(momId))
        return data["team1"]["players"][momId];
    return data["team2"]["players"][momId];
}

module.exports = {
    getData: getData
}