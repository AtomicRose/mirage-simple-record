var util = require("util");
var fs = require("fs");

var dataProcess = {
    readJSON: function (path, callback) {
        fs.readFile(path, function (err, content) {
            if (err) {
                console.log('read json data error.', err);
                callback(false);
                return false;
            }
            var result = content.toString() ? JSON.parse(content.toString()) : content.toString();
            callback(result);
        });
    },
    writeJSON: function (path, data, callback) {
        if(typeof data === 'object'){
            data = JSON.stringify(data);
        }
        fs.writeFile(path, data, function (err) {
            if (err) {
                console.log('write json data error.', err);
                callback(false);
                return false;
            }
            callback(true);
        });
    }
};

module.exports = dataProcess;