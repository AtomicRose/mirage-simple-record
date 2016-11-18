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
            <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
            <h4 class="' + (isToast ? 'hidden' : '') + '">' + options.title + '</h4>\
            <p>' + htmlStr + '</p>\
            <p class="' + (isConfirm ? '' : 'hidden') + '">\
                <button type="button" class="btn btn-sm btn-' + options.type + '">' + options.okText + '</button>\
                <button type="button" class="btn btn-sm btn-default">' + options.cancelText + '</button>\
            </p>\
        </div>'
    return html;
}

module.exports = dialog;