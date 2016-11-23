var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var getWorkerList = function(callback){
    dataProcess.readJSON(variable.data.worker, function(data){
        if(data && data.workers && data.workers.length){
            callback(data.workers);
        }else{
            callback(false);
        }
    })
};
module.exports = getWorkerList;