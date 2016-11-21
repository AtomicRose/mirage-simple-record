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
	var ProjectManageCtrl = __webpack_require__(9);

	WorkerManageCtrl();
	ProjectManageCtrl();

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var dialog = __webpack_require__(3);
	var dataProcess = __webpack_require__(5);
	var variable = __webpack_require__(8);

	var WorkerManageCtrl = function WorkerManageCtrl() {
	    $(document).ready(function () {
	        if (document.body.getAttribute('controller') != 'WorkerManageCtrl') {
	            return false;
	        }
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
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                if (data === false) {
	                    dialog.toast('添加失败，请重试', {
	                        type: 'danger'
	                    });
	                    return false;
	                }
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
	                dataProcess.writeJSON(variable.data.worker, JSON.stringify(data), function (flag) {
	                    if (flag) {
	                        dialog.toast('添加成功', {
	                            type: 'success'
	                        });
	                        $('#input_workerName').val('');
	                        showWorkerList();
	                    } else {
	                        dialog.toast('添加失败，请重试', {
	                            type: 'danger'
	                        });
	                    }
	                });
	            });
	        });

	        showWorkerList();
	        function showWorkerList() {
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                if (data && data.workers && data.workers.length) {
	                    var list = data.workers.reverse();
	                    $('#table_workerList tr').slice(1).each(function () {
	                        this.remove();
	                    });
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].status === 1) {
	                            var ele = document.createElement('tr');
	                            ele.innerHTML = '<td>' + list[i].id + '</td>\
	                            <td>' + list[i].name + '</td>\
	                            <td>' + list[i].entryTime + '</td>\
	                            <td><button class="btn btn-sm btn-warning btn-worker-modify" data-toggle="modal" data-target="#modifyModal" data-worker="' + list[i].id + '">修改</button><button class="btn btn-sm btn-danger btn-worker-delete" data-worker="' + list[i].id + '">删除</button></td>';
	                            $('#table_workerList').append(ele);
	                        }
	                    }
	                    $('.btn-worker-modify').on('click', function () {
	                        //modify the worker by id
	                        var id = parseInt(this.getAttribute('data-worker'));
	                        modifyWorkerById(id);
	                    });
	                    $('.btn-worker-delete').on('click', function () {
	                        //delete the worker by id
	                        var id = parseInt(this.getAttribute('data-worker'));
	                        dialog.confirm('确定删除该人员吗？', {
	                            type: 'danger',
	                            title: '确认信息',
	                            callback: function callback(value) {
	                                if (value) {
	                                    deleteWorkerById(id);
	                                }
	                            }
	                        });
	                    });
	                } else {
	                    var e = document.createElement('tr');
	                    e.innerHTML = '<td colspan="4">暂时还没有人员哦</td>';
	                    return false;
	                }
	            });
	        }

	        function deleteWorkerById(id) {
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                if (data && data.workers && data.workers.length) {
	                    var list = data.workers;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == id) {
	                            list[i].status = 0;
	                            data.workers = list;
	                            dataProcess.writeJSON(variable.data.worker, JSON.stringify(data), function (flag) {
	                                if (flag) {
	                                    dialog.toast('删除成功', {
	                                        type: 'success'
	                                    });
	                                    showWorkerList();
	                                } else {
	                                    dialog.toast('删除失败，请重试', {
	                                        type: 'danger'
	                                    });
	                                }
	                            });
	                            return true;
	                        }
	                    }
	                    dialog.toast('未找到相关人员', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关人员', {
	                        type: 'warning'
	                    });
	                }
	            });
	        }

	        function modifyWorkerById(id) {
	            dataProcess.readJSON(variable.data.worker, function (data) {
	                if (data && data.workers && data.workers.length) {
	                    var list = data.workers;
	                    var currentIndex;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == id) {
	                            currentIndex = i;
	                            var currentWorker = list[i];
	                            $('#modifyWorkerName').val(currentWorker.name);
	                            $('#modifyEntryTime').val(currentWorker.entryTime);
	                            $('#btn_modifyWorkerSave').click(function () {
	                                currentWorker.name = $('#modifyWorkerName').val();
	                                currentWorker.entryTime = $('#modifyEntryTime').val();
	                                data.workers[currentIndex] = currentWorker;
	                                dataProcess.writeJSON(variable.data.worker, JSON.stringify(data), function (flag) {
	                                    if (flag) {
	                                        dialog.toast('修改成功', {
	                                            type: 'success'
	                                        });
	                                        $('#modifyModal').modal('hide');
	                                        showWorkerList();
	                                    } else {
	                                        dialog.toast('修改失败，请重试', {
	                                            type: 'danger'
	                                        });
	                                    }
	                                });
	                            });
	                            return true;
	                        }
	                    }
	                    dialog.toast('未找到相关人员', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关人员', {
	                        type: 'warning'
	                    });
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
	        var cancel = ele.getElementsByClassName('btn-confirm-cancel');
	        for (var i = 0; i < cancel.length; i++) {
	            cancel[i].addEventListener('click', function () {
	                if (config.callback) {
	                    config.callback(false);
	                }
	                ele.remove();
	            });
	        }
	        var ok = ele.getElementsByClassName('btn-confirm-ok');
	        for (var j = 0; j < ok.length; j++) {
	            ok[j].addEventListener('click', function () {
	                if (config.callback) {
	                    config.callback(true);
	                }
	                ele.remove();
	            });
	        }
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
	            <button type="button" class="close btn-confirm-cancel" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\
	            <h4 class="' + (isToast ? 'hidden' : '') + '">' + options.title + '</h4>\
	            <p>' + htmlStr + '</p>\
	            <p class="' + (isConfirm ? '' : 'hidden') + '">\
	                <button type="button" class="btn btn-sm btn-' + options.type + ' btn-confirm-ok">' + options.okText + '</button>\
	                <button type="button" class="btn btn-sm btn-default btn-confirm-cancel">' + options.cancelText + '</button>\
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
	                callback(false);
	                return false;
	            }
	            var result = content.toString() ? JSON.parse(content.toString()) : content.toString();
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
	                callback(false);
	                return false;
	            }
	            callback(true);
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
	        worker: 'src/data/worker.json',
	        project: 'src/data/project.json'
	    }
	};
	module.exports = variable;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var dialog = __webpack_require__(3);
	var dataProcess = __webpack_require__(5);
	var variable = __webpack_require__(8);

	var ProjectManageCtrl = function ProjectManageCtrl() {
	    $(document).ready(function () {
	        if (document.body.getAttribute('controller') != 'ProjectManageCtrl') {
	            return false;
	        }
	        showProjectsList();
	        $('#btn_addProcess').click(function () {
	            addProcessElement('processBox');
	        });
	        $('#btn_addProcess2').click(function () {
	            addProcessElement('processBox2');
	        });
	        $('#btn_submitAddProject').click(function () {
	            var projectName = $('#projectName').val();
	            var processList = [];
	            var eList = $('#processBox .item');
	            eList.each(function () {
	                processList.push({
	                    id: $(this).find('.process-id').val(),
	                    name: $(this).find('.process-name').val()
	                });
	            });
	            var projectObj = {
	                id: new Date().getTime(),
	                name: projectName,
	                process: processList,
	                status: 1
	            };
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data === false) {
	                    dialog.toast('添加失败，请重试', {
	                        type: 'danger'
	                    });
	                    return false;
	                }
	                if (!data) {
	                    data = {};
	                    data.projects = [];
	                }
	                data.projects.push(projectObj);
	                dataProcess.writeJSON(variable.data.project, JSON.stringify(data), function (flag) {
	                    if (flag) {
	                        dialog.toast('添加成功', {
	                            type: 'success'
	                        });
	                        // remove the process and the project name value
	                        $('#projectName').val('');
	                        $('#processBox .item').each(function () {
	                            $(this).remove();
	                        });
	                        showProjectsList();
	                    } else {
	                        dialog.toast('添加失败，请重试', {
	                            type: 'danger'
	                        });
	                    }
	                });
	            });
	        });

	        function addProcessElement(eleId) {
	            var e_item = document.createElement('div');
	            e_item.className = 'item';
	            e_item.innerHTML = '<div class="form-group">\
	                    <div class="input-group">\
	                        <div class="input-group-addon">工序号</div>\
	                        <input class="form-control process-id" type="email" placeholder="请输入工序号">\
	                    </div>\
	                </div>\
	                <div class="form-group">\
	                    <div class="input-group">\
	                        <div class="input-group-addon">工序名称</div>\
	                        <input class="form-control process-name" type="email" placeholder="请输入工序名称">\
	                    </div>\
	                </div>\
	                <button type="button" class="btn btn-xs btn-danger btn-delete-process">删除</button>';
	            $('#' + eleId).append(e_item);
	            $('.btn-delete-process').click(function () {
	                $(this).parent('.item').remove();
	            });
	        }

	        function showProjectsList() {
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data && data.projects && data.projects.length) {
	                    var list = data.projects.reverse();
	                    $('#projectBox .panel-default').each(function () {
	                        $(this).remove();
	                    });
	                    var isOpen = true;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].status === 1) {
	                            var projectName = list[i].name;
	                            var projectId = list[i].id;
	                            var processList = list[i].process;
	                            var ele = document.createElement('div');
	                            ele.className = 'panel panel-default';
	                            ele.innerHTML = '<div class="panel-heading" role="tab" id="heading_' + projectId + '">\
	                            <h4 class="panel-title">\
	                            <a data-toggle="collapse" data-parent="#projectBox" href="#collapse_' + projectId + '" aria-expanded="' + isOpen + '" aria-controls="collapse_' + projectId + '">' + projectName + '</a>\
	                            <button type="button" class="btn btn-xs btn-danger fn-fr btn-delete-project" data-project="' + projectId + '">删除</button><button type="button" class="btn btn-xs btn-warning fn-fr btn-modify-project" data-toggle="modal" data-target="#modifyProjectModal" data-project="' + projectId + '">修改</button>\
	                        </h4>\
	                        </div>\
	                        <div id="collapse_' + projectId + '" class="panel-collapse collapse ' + (isOpen ? 'in' : '') + '" role="tabpanel" aria-labelledby="heading_' + projectId + '" aria-expanded="' + isOpen + '">\
	                            <div class="panel-body">\
	                                <div class="table-responsive">\
	                                    <table class="table table-striped table-bordered" id="table_' + projectId + '">\
	                                        <tr>\
	                                        <th>工序号</th>\
	                                        <th>工序名称</th>\
	                                        <th>操作</th>\
	                                        </tr>\
	                                    </table>\
	                                </div>\
	                                <button class="btn btn-default btn-modify-add-process" data-toggle="modal" data-target="#modifyAddProcessModal" data-project="' + projectId + '">添加工序</button>\
	                            </div>\
	                            </div>';
	                            $('#projectBox').append(ele);
	                            isOpen = false;
	                            //repeat the process

	                            if (processList && processList.length) {
	                                $('#table_' + projectId + ' tr').slice(1).each(function () {
	                                    $(this).remove();
	                                });
	                                for (var j = 0, plen = processList.length; j < plen; j++) {
	                                    var processId = processList[j].id;
	                                    var processName = processList[j].name;
	                                    var ne = document.createElement('tr');
	                                    ne.innerHTML = '<td>' + processId + '</td>\
	                                            <td>' + processName + '</td>\
	                                            <td><button type="button" class="btn btn-sm btn-warning btn-modify-process" data-toggle="modal" data-target="#modifyProcessModal" data-project="' + projectId + '" data-process="' + processId + '">修改</button><button type="button" class="btn btn-sm btn-danger btn-delete-process-id" data-project="' + projectId + '" data-process="' + processId + '">删除</button></td>';
	                                    $('#table_' + projectId).append(ne);
	                                }
	                            }
	                        }
	                    }
	                    $('.btn-modify-process').click(function () {
	                        //modify the process
	                        var projectId = parseInt(this.getAttribute('data-project'));
	                        var processId = parseInt(this.getAttribute('data-process'));
	                        modifyProcessById(projectId, processId);
	                    });
	                    $('.btn-delete-process-id').click(function () {
	                        var projectId = parseInt(this.getAttribute('data-project'));
	                        var processId = parseInt(this.getAttribute('data-process'));
	                        //delete the process
	                        dialog.confirm('确定删除该工序吗？', {
	                            title: '确定信息',
	                            type: 'danger',
	                            callback: function callback(value) {
	                                if (value) {
	                                    //do delete
	                                    deleteProcessById(projectId, processId);
	                                }
	                            }
	                        });
	                    });
	                    $('.btn-modify-project').click(function () {
	                        //modify the project
	                        var projectId = parseInt(this.getAttribute('data-project'));
	                        modifyProjectById(projectId);
	                    });
	                    $('.btn-delete-project').click(function () {
	                        //delete the project
	                        var projectId = parseInt(this.getAttribute('data-project'));
	                        dialog.confirm('确定删除该产品/款式吗？', {
	                            title: '确定信息',
	                            type: 'danger',
	                            callback: function callback(value) {
	                                if (value) {
	                                    //do delete
	                                    deleteProjectById(projectId);
	                                }
	                            }
	                        });
	                    });
	                    $('.btn-modify-add-process').click(function () {
	                        $('#processBox2 .item').slice(1).each(function () {
	                            $(this).remove();
	                        });
	                    });
	                } else {
	                    dialog.toast('暂时还没有产品数据哦', {
	                        type: 'danger'
	                    });
	                    return false;
	                }
	            });
	        }

	        function modifyProjectById(projectId) {
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data && data.projects && data.projects.length) {
	                    var list = data.projects;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == projectId) {
	                            var currentProject = list[i];
	                            $('#modifyProjectName').val(currentProject.name);
	                            $('#btn_modifyProjectSave').click(function () {
	                                currentProject.name = $('#modifyProjectName').val();
	                                data.projects[i] = currentProject;
	                                dataProcess.writeJSON(variable.data.project, JSON.stringify(data), function (flag) {
	                                    if (flag) {
	                                        dialog.toast('修改成功', {
	                                            type: 'success'
	                                        });
	                                        $('#modifyProjectModal').modal('hide');
	                                        showProjectsList();
	                                    } else {
	                                        dialog.toast('修改失败，请重试', {
	                                            type: 'danger'
	                                        });
	                                    }
	                                });
	                            });
	                            return true;
	                        }
	                    }
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                }
	            });
	        }
	        function modifyProcessById(projectId, processId) {
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data && data.projects && data.projects.length) {
	                    var list = data.projects;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == projectId) {
	                            var processList = list[i].process;
	                            for (var j = 0, plen = processList.length; j < plen; j++) {
	                                if (processList[j].id == processId) {
	                                    var currentProcess = processList[j];
	                                    $('#modifyProcessId').val(currentProcess.id);
	                                    $('#modifyProcessName').val(currentProcess.name);
	                                    $('#btn_modifyProcessSave').click(function () {
	                                        currentProcess.id = $('#modifyProcessId').val();
	                                        currentProcess.name = $('#modifyProcessName').val();
	                                        data.projects[i].process[j] = currentProcess;
	                                        dataProcess.writeJSON(variable.data.project, JSON.stringify(data), function (flag) {
	                                            if (flag) {
	                                                dialog.toast('修改成功', {
	                                                    type: 'success'
	                                                });
	                                                $('#modifyProcessModal').modal('hide');
	                                                showProjectsList();
	                                            } else {
	                                                dialog.toast('修改失败，请重试', {
	                                                    type: 'danger'
	                                                });
	                                            }
	                                        });
	                                    });
	                                    return true;
	                                }
	                            }
	                        }
	                    }
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                }
	            });
	        }
	        function deleteProjectById(projectId) {
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data && data.projects && data.projects.length) {
	                    var list = data.projects;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == projectId) {
	                            list[i].status = 0;
	                            data.projects = list;
	                            console.log(data);
	                            dataProcess.writeJSON(variable.data.project, JSON.stringify(data), function (flag) {
	                                if (flag) {
	                                    dialog.toast('删除成功', {
	                                        type: 'success'
	                                    });
	                                    showProjectsList();
	                                } else {
	                                    dialog.toast('删除失败，请重试', {
	                                        type: 'danger'
	                                    });
	                                }
	                            });
	                            return true;
	                        }
	                    }
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                }
	            });
	        }
	        function deleteProcessById(projectId, processId) {
	            dataProcess.readJSON(variable.data.project, function (data) {
	                if (data && data.projects && data.projects.length) {
	                    var list = data.projects;
	                    for (var i = 0, len = list.length; i < len; i++) {
	                        if (list[i].id == projectId) {
	                            var processList = list[i].process;
	                            for (var j = 0, plen = processList.length; j < plen; j++) {
	                                if (processList[j].id == processId) {
	                                    data.projects[i].process.splice(j, 1);
	                                    dataProcess.writeJSON(variable.data.project, JSON.stringify(data), function (flag) {
	                                        if (flag) {
	                                            dialog.toast('删除成功', {
	                                                type: 'success'
	                                            });
	                                            showProjectsList();
	                                        } else {
	                                            dialog.toast('删除失败，请重试', {
	                                                type: 'danger'
	                                            });
	                                        }
	                                    });
	                                    return true;
	                                }
	                            }
	                        }
	                    }
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                } else {
	                    dialog.toast('未找到相关工序', {
	                        type: 'warning'
	                    });
	                }
	            });
	        }
	    });
	};

	module.exports = ProjectManageCtrl;

/***/ }
/******/ ]);