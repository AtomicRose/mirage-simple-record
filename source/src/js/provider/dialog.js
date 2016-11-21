var extend = require("./extend");
var defaults = {
    title: '温馨提示',
    type: 'warning',
    okText: '确  定',
    cancelText: '取  消',
    timeout: 3
};
var dialog = {
    alert: function (str, config) {
        var options = defaults;

        extend(options, config ? config : {});
        var ele = document.createElement('div');
        ele.innerHTML = setHtml(str, options);
        document.body.appendChild(ele);
    },
    confirm: function (str, config) {
        var options = defaults;

        extend(options, config ? config : {});
        var ele = document.createElement('div');
        ele.innerHTML = setHtml(str, options, true);
        document.body.appendChild(ele);
        var cancel = ele.getElementsByClassName('btn-confirm-cancel');
        for(var i=0; i<cancel.length; i++){
            cancel[i].addEventListener('click', function(){
                if(config.callback){
                    config.callback(false);
                }
                ele.remove();
            });
        }
        var ok = ele.getElementsByClassName('btn-confirm-ok');
        for(var j=0; j<ok.length; j++){
            ok[j].addEventListener('click', function(){
                if(config.callback){
                    config.callback(true);
                }
                ele.remove();
            });
        }
    },
    toast: function (str, config) {
        var options = defaults;
        options.type = 'danger';

        extend(options, config ? config : {});
        var ele = document.createElement('div');
        ele.innerHTML = setHtml(str, options, false, true);
        document.body.appendChild(ele);
        setTimeout(function () {
            ele.remove();
        }, options.timeout * 1000);
    }
};

function setHtml(htmlStr, options, isConfirm, isToast) {
    var html = '<div class="alert alert-' + options.type + ' alert-dismissible fade in" role="alert">\
            <button type="button" class="close btn-confirm-cancel" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
            <h4 class="' + (isToast ? 'hidden' : '') + '">' + options.title + '</h4>\
            <p>' + htmlStr + '</p>\
            <p class="' + (isConfirm ? '' : 'hidden') + '">\
                <button type="button" class="btn btn-sm btn-' + options.type + ' btn-confirm-ok">' + options.okText + '</button>\
                <button type="button" class="btn btn-sm btn-default btn-confirm-cancel">' + options.cancelText + '</button>\
            </p>\
        </div>'
    return html;
}

module.exports = dialog;