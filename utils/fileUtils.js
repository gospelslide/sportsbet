const path = require('path');

var getStaticFilePath = function(filename) {
    return path.join(__dirname + '/../static/' + filename);
}

module.exports = {
    getStaticFilePath: getStaticFilePath
}