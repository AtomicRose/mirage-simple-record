/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var WorkerManageCtrl = __webpack_require__(2);

	WorkerManageCtrl();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var dialog = __webpack_require__(3);
	var dataProcess = __webpack_require__(5);
	var variable = __webpack_require__(8);

	var WorkerManageCtrl = function WorkerManageCtrl() {
	    $(document).ready(function () {
	        var now = new Date();
	        $('#input_entryDate').val(now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString());
	        $('#btn_addWorker').click(function () {
	            var eThis = this;
	            var workerName = $('#input_workerName').val();
	            var entryTime = $('#input_entryDate').val();
	            if (!workerName) {
	                dialog.toast('请填写姓名');
	                return false;
	            }
	            // if(!entryTime){
	            //     dialog.toast('请选择入职时间');
	            //     return false;
	            // }
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                console.log(data);
	                if (!data) {
	                    data = {};
	                    data.workers = [];
	                }
	                data.workers.push({
	                    name: workerName,
	                    entryTime: entryTime,
	                    status: 1,
	                    id: data.workers.length + 1
	                });
	                console.log(data);
	                dataProcess.writeJSON(variable.data.worker, JSON.stringify(data), function () {
	                    dialog.toast('添加成功', {
	                        type: 'success'
	                    });
	                });
	            });
	        });

	        showWorkerList();
	        function showWorkerList() {
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                if (data && data.workers && data.workers.length) {
	                    var list = data.workers;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        var ele = document.createElement('tr');
	                        ele.innerHTML = '<td>' + list[i].id + '</td>\
	                            <td>' + list[i].name + '</td>\
	                            <td>' + list[i].entryTime + '</td>\
	                            <td><button class="btn btn-sm btn-warning btn-worker-modify" data-worker="' + list[i].id + '">修改</button><button class="btn btn-sm btn-danger btn-worker-delete" data-worker="' + list[i].id + '">删除</button></td>';
	                        $('#table_workerList').append(ele);
	                    }
	                    $('.btn-worker-modify').on('click', function () {
	                        console.log(this);
	                    });
	                    $('.btn-worker-delete').on('click', function () {
	                        console.log(this);
	                    });
	                } else {
	                    var e = document.createElement('tr');
	                    e.innerHTML = '<td colspan="4">暂时还没有人员哦</td>';
	                    return false;
	                }
	            });
	        }
	    });
	};

	module.exports = WorkerManageCtrl;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var extend = __webpack_require__(4);
	var defaults = {
	    title: '温馨提示',
	    type: 'warning',
	    okText: '确  定',
	    cancelText: '取  消',
	    timeout: 3
	};
	var dialog = {
	    alert: function alert(str, config) {
	        var options = defaults;

	        extend(options, config ? config : {});
	        var ele = document.createElement('div');
	        ele.innerHTML = setHtml(str, options);
	        document.body.appendChild(ele);
	    },
	    confirm: function confirm(str, config) {
	        var options = defaults;

	        extend(options, config ? config : {});
	        var ele = document.createElement('div');
	        ele.innerHTML = setHtml(str, options, true);
	        document.body.appendChild(ele);
	    },
	    toast: function toast(str, config) {
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
	        </div>';
	    return html;
	}

	module.exports = dialog;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var extend = function extend(o, n, override) {
	    for (var key in n) {
	        o[key] = n[key];
	    }
	};

	module.exports = extend;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var util = __webpack_require__(6);
	var fs = __webpack_require__(7);

	var dataProcess = {
	    readJSON: function readJSON(path, callback) {
	        fs.readFile(path, function (err, content) {
	            if (err) {
	                console.log('read json data error.', err);
	                return false;
	            }
	            var result = content.toString() ? JSON.parse(content.toString()) : content.toString();
	            console.log(result);
	            callback(result);
	        });
	    },
	    writeJSON: function writeJSON(path, data, callback) {
	        if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === 'object') {
	            data = JSON.stringify(data);
	        }
	        fs.writeFile(path, data, function (err) {
	            if (err) {
	                console.log('write json data error.', err);
	                return false;
	            }
	            callback();
	        });
	    }
	};

	module.exports = dataProcess;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("util");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var variable = {
	    data: {
	        worker: 'src/data/worker.json'
	    }
	};
	module.exports = variable;

/***/ }
/******/ ]);