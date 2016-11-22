var pinyin = require('../provider/pinyin');
var RecordManageCtrl = function(){
    $(document).ready(function () {
        if (document.body.getAttribute('controller') != 'RecordManageCtrl') {
            return false;
        }
        console.log(pinyin.getFullSpell('方柏蜃'));
    });
};
module.exports = RecordManageCtrl;