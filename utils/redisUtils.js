const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
    console.log("Redis connected!");
});

var setRedisKey = function(key, value, expiry, callback) {
    if (typeof callback === "undefined")
        callback = redis.print;
    client.set(key, value, callback);
    if (!!expiry)
        client.expire(key, expiry);
} 

var getRedisKey = function(key, callback) {
    client.get(key, callback);
}

module.exports = {
    setRedisKey: setRedisKey,
    getRedisKey: getRedisKey
}