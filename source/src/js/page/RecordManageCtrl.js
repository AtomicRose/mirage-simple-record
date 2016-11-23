var pinyin = require('../provider/pinyin');
var getProjectList = require('./getProjectList');
var getWorkerList = require('./getWorkerList');
var getWorkRecordByDate = require('./getWorkRecordByDate');
var dialog = require('../provider/dialog');
var dataProcess = require('../provider/dataProcess');
var variable = require('../provider/variable');

var RecordManageCtrl = function () {
    $(document).ready(function () {
        if (document.body.getAttribute('controller') != 'RecordManageCtrl') {
            return false;
        }
        var now = new Date();
        var nowStr = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();
        $('#workDate').val(nowStr)
        $('#search_startTime').val(nowStr);
        $('#search_endTime').val(nowStr);
        getWorkerList(function (data) {
            $('#workerId option').slice(1).each(function () {
                this.remove();
            });
            $('#search_workerName option').slice(1).each(function () {
                this.remove();
            });
            if (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var e = document.createElement('option');
                    e.value = data[i].id;
                    e.innerHTML = data[i].name;
                    e.setAttribute('data-worker-name', data[i].name);
                    $('#workerId').append(e);
                    var e2 = document.createElement('option');
                    e2.value = data[i].id;
                    e2.innerHTML = data[i].name;
                    e2.setAttribute('data-worker-name', data[i].name);
                    $('#search_workerName').append(e2);
                }
            }
        });
        getProjectList(function (data) {
            $('#projectId option').slice(1).each(function () {
                this.remove();
            });
            if (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var e = document.createElement('option');
                    e.value = data[i].id;
                    e.innerHTML = data[i].name;
                    e.setAttribute('data-project-name', data[i].name);
                    $('#projectId').append(e);
                }
                $('#projectId').on('change', function () {
                    var currentProjectId = $('#projectId').val();
                    $('#processId option').slice(1).each(function () {
                        this.remove();
                    });
                    for (var j = 0, plen = data.length; j < plen; j++) {
                        if (currentProjectId == data[j].id) {
                            var processList = data[j].process;
                            if (processList && processList.length) {
                                for (var k = 0, pplen = processList.length; k < pplen; k++) {
                                    var ele = document.createElement('option');
                                    ele.value = processList[k].id;
                                    ele.innerHTML = '【' + processList[k].id + '】' + processList[k].name;
                                    ele.setAttribute('data-process-name', processList[k].name);
                                    $('#processId').append(ele);
                                }
                            }
                            return true;
                        }
                    }
                });
            }
        });
        $('#btn_addWorkRecord').on('click', function () {
            var workDate = $('#workDate').val();
            var workerId = $('#workerId').val();
            var e_workerId = document.getElementById('workerId');
            var workerName = e_workerId.options[e_workerId.selectedIndex].getAttribute('data-worker-name');
            var projectId = $('#projectId').val();
            var e_projectId = document.getElementById('projectId');
            var projectName = e_projectId.options[e_projectId.selectedIndex].getAttribute('data-project-name');
            var processId = $('#processId').val();
            var e_processId = document.getElementById('processId');
            var processName = e_processId.options[e_projectId.selectedIndex].getAttribute('data-process-name');
            var workCount = $('#workCount').val();
            if (workerId == -1) {
                dialog.toast('请选择工作人员', {
                    type: 'danger'
                });
                return false;
            }
            if (projectId == -1) {
                dialog.toast('请选择产品/款式', {
                    type: 'danger'
                });
                return false;
            }
            if (processId == -1) {
                dialog.toast('请选择工序', {
                    type: 'danger'
                });
                return false;
            }
            if (!workCount) {
                dialog.toast('请输入工作数量', {
                    type: 'danger'
                });
                return false;
            }
            getWorkRecordByDate(workDate.replace(/\-/g, ''), '', function (data) {
                var recordObj;
                if (!data) {
                    recordObj = {};
                    recordObj[workerId] = [
                        {
                            time: workDate,
                            workerId: workerId,
                            workerName: workerName,
                            projectId: projectId,
                            projectName: projectName,
                            processId: processId,
                            processName: processName,
                            count: workCount,
                            recordId: new Date().getTime()
                        }
                    ];
                } else {
                    recordObj = data;
                    if (recordObj[workerId]) {
                        recordObj[workerId].push({
                            time: workDate,
                            workerId: workerId,
                            workerName: workerName,
                            projectId: projectId,
                            projectName: projectName,
                            processId: processId,
                            processName: processName,
                            count: workCount,
                            recordId: new Date().getTime()
                        });
                    } else {
                        recordObj[workerId] = [
                            {
                                time: workDate,
                                workerId: workerId,
                                workerName: workerName,
                                projectId: projectId,
                                projectName: projectName,
                                processId: processId,
                                processName: processName,
                                count: workCount,
                                recordId: new Date().getTime()
                            }
                        ];
                    }
                }
                dataProcess.writeJSON(variable.data.recordBase + workDate.replace(/\-/g, '') + '.json', JSON.stringify(recordObj), function (value) {
                    if (value) {
                        dialog.toast('记录成功', {
                            type: 'success'
                        });
                        $('#workerId').val(-1);
                        $('#projectId').val(-1);
                        $('#processId').val(-1);
                        $('#workCount').val('');
                        showTodayData();
                        return true;
                    }
                    dialog.toast('记录失败，请重试', {
                        type: 'danger'
                    });
                });
            });
        });
        //console.log(pinyin.getFullSpell('方柏蜃'));

        $('#btn_searchRecord').on('click', function () {
            showSearchData();
        });
        function sortByName(a, b) {
            return a.workerName > b.workerName ? 1 : -1;
        }

        function sortByTime(a, b) {
            return a.time > b.time ? 1 : -1;
        }

        function appendToRecord(list) {
            for (var i = 0, len = list.length; i < len; i++) {
                var e = document.createElement('tr');
                var thisObj = list[i];
                e.innerHTML = '<td>' + thisObj.workerName + '</td>\
                    <td>' + thisObj.time + '</td>\
                    <td>' + thisObj.projectName + '</td>\
                    <td>' + thisObj.processName + '</td>\
                    <td>' + thisObj.count + '</td>\
                    <td><button type="button" class="btn btn-sm btn-warning btn-modify-record" data-time="' + thisObj.time + '" data-worker-id="' + thisObj.workerId + '" data-record-id="' + thisObj.recordId + '">修改</button><button type="button" class="btn btn-sm btn-danger btn-delete-record" data-time="' + thisObj.time + '" data-worker-id="' + thisObj.workerId + '" data-record-id="' + thisObj.recordId + '">删除</button></td>';
                $('#table_recordList').append(e);

                //modify teh record
            }
            //delete the record
        }

        $(document).on('click','.btn-delete-record',function(){
            var time =this.getAttribute('data-time');
            var workerId = this.getAttribute('data-worker-id');
            var recordId = this.getAttribute('data-record-id');
            deleteRecord(time, workerId, recordId);
        });

        function deleteRecord(time, workerId, recordId) {
            getWorkRecordByDate(time.replace(/\-/g, ''), '', function (data) {
                if (data) {
                    if (data[workerId] && data[workerId].length) {
                        var list = data[workerId];
                        for (var i = 0, len = list.length; i < len; i++) {
                            if (list[i].recordId == recordId) {
                                list = list.splice(i, 1);
                                data[workerId] == list;
                                dataProcess.writeJSON(variable.data.recordBase + time.replace(/\-/g, '') + '.json', data, function (value) {
                                    if (value) {
                                        dialog.toast('删除成功', {
                                            type: 'success'
                                        });
                                        showSearchData();
                                    } else {
                                        dialog.toast('删除失败', {
                                            type: 'danger'
                                        });
                                    }
                                });
                                return true;
                            }
                        }
                        dialog.toast('没有找到该记录', {
                            type: 'danger'
                        });
                    } else {
                        dialog.toast('没有找到该记录', {
                            type: 'danger'
                        });
                    }
                } else {
                    dialog.toast('没有找到该记录', {
                        type: 'danger'
                    });
                }
            })
        }

        function showTodayData() {
            $('#table_recordList tr').slice(1).each(function () {
                this.remove();
            });
            var thisDate = new Date();
            var yearStr = thisDate.getFullYear().toString();
            var monthStr = (thisDate.getMonth() + 1).toString();
            var dayStr = thisDate.getDate().toString();
            var timeStr = yearStr + ((monthStr.length == 1) ? '0' + monthStr : monthStr) + ((dayStr.length == 1) ? '0' + dayStr : dayStr);
            getWorkRecordByDate(timeStr, '', function (data) {
                if (data) {
                    if (typeof data === 'object' && typeof data.length === 'undefined') {
                        for (var key in data) {
                            appendToRecord(data[key]);
                        }
                    } else {
                        appendToRecord(data);
                    }
                }
            });
        }

        function showSearchData() {
            var startTime = $('#search_startTime').val();
            var endTime = $('#search_endTime').val();
            if (new Date(endTime).getTime() > new Date(new Date().toDateString()).getTime()) {
                endTime = new Date().toDateString();
            }
            $('#table_recordList tr').slice(1).each(function () {
                this.remove();
            });
            var workerName = $('#search_workerName').val();
            var st = new Date(new Date(startTime).toDateString()).getTime();
            var et = new Date(new Date(endTime).toDateString()).getTime();
            var count = (et - st) / 1000 / 3600 / 24 + 1;
            var sortArray = [];
            for (var i = st; i <= et + 1; i = i + 1000 * 3600 * 24) {
                var thisDate = new Date(i);
                var yearStr = thisDate.getFullYear().toString();
                var monthStr = (thisDate.getMonth() + 1).toString();
                var dayStr = thisDate.getDate().toString();
                var timeStr = yearStr + ((monthStr.length == 1) ? '0' + monthStr : monthStr) + ((dayStr.length == 1) ? '0' + dayStr : dayStr);
                getWorkRecordByDate(timeStr, (workerName == -1 ? '' : workerName), function (data) {
                    if (data) {
                        if (typeof data === 'object' && typeof data.length === 'undefined') {
                            for (var key in data) {
                                sortArray = sortArray.concat(data[key]);
                                //appendToRecord(data[key]);
                            }
                        } else {
                            sortArray = sortArray.concat(data);
                            //appendToRecord(data);
                        }
                        count--;
                    } else {
                        count--;
                    }
                    if (count == 0) {
                        appendToRecord(sortArray.sort(sortByName));
                    }
                });
            }
        }
    });
};
module.exports = RecordManageCtrl;