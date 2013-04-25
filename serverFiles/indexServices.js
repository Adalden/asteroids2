/*jshint node:true*/

module.exports = function () {

    return {
        stopServer: function (request, response, next) {
            process.exit();
        }
    };
};
