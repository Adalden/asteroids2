/*jshint node:true*/

module.exports = function () {

var fs = require('fs');
    return {
        getScores: function (request, response, next) {
            var scores = JSON.parse(fs.readFileSync('serverData/highScores.JSON'));
            response.send(scores);
        },
        saveScores: function(request, response, next){
            var data = request.body.scores;
            fs.writeFile('serverData/highScores.JSON', JSON.stringify(data));
            response.send(data);
        }
    };
};