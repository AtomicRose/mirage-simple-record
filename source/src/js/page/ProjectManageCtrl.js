var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var ProjectManageCtrl = function () {
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
                id: (new Date()).getTime(),
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

                })
            })
        });

        function addProcessElement(eleId){
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
            $('#'+eleId).append(e_item);
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
                            <a data-toggle="collapse" data-parent="#projectBox" href="#collapse_' + projectId + '" aria-expanded="' + (isOpen) + '" aria-controls="collapse_' + projectId + '">' + projectName + '</a>\
                            <button type="button" class="btn btn-xs btn-danger fn-fr btn-delete-project" data-project="' + projectId + '">删除</button><button type="button" class="btn btn-xs btn-warning fn-fr btn-modify-project" data-toggle="modal" data-target="#modifyProjectModal" data-project="' + projectId + '">修改</button>\
                        </h4>\
                        </div>\
                        <div id="collapse_' + projectId + '" class="panel-collapse collapse ' + (isOpen ? 'in' : '') + '" role="tabpanel" aria-labelledby="heading_' + projectId + '" aria-expanded="' + (isOpen) + '">\
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
                                <button class="btn btn-default btn-modify-add-process" data-toggle="modal" data-target="#modifyAddProcessModal" data-project="'+projectId+'">添加工序</button>\
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
                            callback: function (value) {
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
                            callback: function (value) {
                                if (value) {
                                    //do delete
                                    deleteProjectById(projectId);
                                }
                            }
                        });
                    });
                    $('.btn-modify-add-process').click(function(){
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
            })
        }

        function modifyProjectById(projectId) {
            dataProcess.readJSON(variable.data.project, function (data) {
                if (data && data.projects && data.projects.length) {
                    var list = data.projects;
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (list[i].id == projectId) {
                            var currentProject = list[i];
                            $('#modifyProjectName').val(currentProject.name);
                            $('#btn_modifyProjectSave').click(function(){
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
                                if(processList[j].id == processId){
                                    var currentProcess = processList[j];
                                    $('#modifyProcessId').val(currentProcess.id);
                                    $('#modifyProcessName').val(currentProcess.name);
                                    $('#btn_modifyProcessSave').click(function(){
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
        function deleteProjectById(projectId){
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
        function deleteProcessById(projectId, processId){
            dataProcess.readJSON(variable.data.project, function (data) {
                if (data && data.projects && data.projects.length) {
                    var list = data.projects;
                    for (var i = 0, len = list.length; i < len; i++) {
                        if (list[i].id == projectId) {
                            var processList = list[i].process;
                            for (var j = 0, plen = processList.length; j < plen; j++) {
                                if(processList[j].id == processId){
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