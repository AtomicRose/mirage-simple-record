var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var getWorkRecordByDate = function (date, filterId, callback) {
    dataProcess.readJSON(variable.data.recordBase + date + '.json', function (data) {
        if (data) {
            if(filterId){
                if(data[filterId]){
                   callback(data[filterId]);
                }else{
                    callback(false);
                    dialog.toast(date+'时，该工作者没有工作记录', {
                        type: 'warning'
                    });
                }
            }else{
                callback(data);
            }

        } else {
            callback(false);
        }
    })
};
module.exports = getWorkRecordByDate;