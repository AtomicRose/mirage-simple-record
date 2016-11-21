var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var WorkerManageCtrl = function () {
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

                })
            })

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
                        dialog.confirm('确定删除该人员吗？',{
                            type: 'danger',
                            title: '确认信息',
                            callback: function(value){
                                if(value){
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

            })
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

