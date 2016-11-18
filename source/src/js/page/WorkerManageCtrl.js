var dialog = require("../provider/dialog");
var dataProcess = require("../provider/dataProcess");
var variable = require("../provider/variable");

var WorkerManageCtrl = function () {
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
                })
            })

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
                            <td><button class="btn btn-sm btn-warning btn-worker-modify" data-worker="'+list[i].id+'">修改</button><button class="btn btn-sm btn-danger btn-worker-delete" data-worker="'+list[i].id+'">删除</button></td>';
                        $('#table_workerList').append(ele);
                    }
                    $('.btn-worker-modify').on('click', function(){
                        console.log(this);
                    });
                    $('.btn-worker-delete').on('click', function(){
                        console.log(this);
                    });
                } else {
                    var e = document.createElement('tr');
                    e.innerHTML = '<td colspan="4">暂时还没有人员哦</td>';
                    return false;
                }

            })
        }
    });
};


module.exports = WorkerManageCtrl;

