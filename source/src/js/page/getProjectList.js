var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var getProjectList = function(callback){
    dataProcess.readJSON(variable.data.project, function(data){
        if(data && data.projects && data.projects.length){
            callback(data.projects);
        }else{
            callback(false);
        }
    })
};
module.exports = getProjectList;