function TaskNew() { }
TaskNew.prototype = {
    constructor: TaskNew,
    init: function () {
        loadTable = TaskNew.prototype.loadTable;
        search = function () {
            TaskNew.prototype.loadTable();
        }

        this.eventSelectTask();

        $(function () {
            searchType('task');
            if ($.cookie('search_all_task')) {
                $('input[name="search_all"]').val($.cookie('search_all_task'));
                $('input[name="search_all"]').change();
                // search()
                $('#panel_search_all').show();
            } else if (window['search_all_task']) {
                $('input[name="search_all"]').val(window['search_all_task']);
                $('input[name="search_all"]').change();
                $('#panel_search_all').show();
                delete window['search_all_task']
            } else {
                $('#table_task').ready(function () {
                    TaskNew.prototype.loadTable();
                });
            }
        });

    },
    eventSelectTask: function (callback) {
        $('#task_select_status').select2().on('change', function (e) {
            let data = $(this).val();
            $('#table_task').DataTable().column(5)
                .search(data.join('|'), true, false)
                .draw();
        });

        if(callback) callback();
    },
    displayList: function (list) {
        function getTimeFromString(st) {
            if (!st || st == '' || !st.includes(' ') || !st.includes(':')) return 0;
            let result = 0;
            let day = numeral(st.split(' ')[0]).value();
            let hh = numeral(st.split(' ')[1].split(':')[0]).value();
            let mm = numeral(st.split(':').pop()).value();
            result += day * 8.64 * 1e7;
            result += hh * 3.6 * 1e6;
            result += mm * 60 * 1e3;
            return result;
        }

        var getTimes = function (duration) {
            var tmp = false;
            if (duration < 0) {
                tmp = true;
                duration = Math.abs(duration)
            }
            var result = '';
            var day = parseInt(duration / 86400);
            var hh = parseInt(duration % 86400 / 3600);
            var mm = parseInt(duration % 86400 % 3600 / 60);
            var ss = parseInt(duration % 86400 % 3600 % 60);
            result += day + ' day' + (day > 1 ? 's ' : ' ');
            result += hh + ':' + mm + ':' + ss;
            if (tmp == true) {
                return '(' + result + ')';
            } else {
                return result;
            }
        }

        let _self = this;

        var tb_data = $('#table_task').DataTable({
            "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Task List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Task List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Task List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Task List - ' + getDateTime(), className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download task list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Task List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,
            destroy: true,
            // pageLength: 10,
            searching: true,
            // paging: true,
            columns: [
                { data: 'id' },
                { data: 'taskName', "searchable": true, className: 'uppercase-first' },
                { data: 'assign_id', "searchable": true, className: 'col-md-2' },
                { data: 'customer_id', "searchable": true },
                { data: 'actionset', "searchable": true, className: 'uppercase-first col-md-1' },
                { data: function(data){return data['status'] || '&nbsp;'}, "searchable": true, className: 'uppercase-first col-md-1' },
                { data: 'dueDate', "searchable": true },
                { data: 'doneDate', "searchable": true },
                {
                    data: function (data) {
                        var duration = (new Date(data.createDate).getTime() + getTimeFromString(data.time) - new Date().getTime()) / 1000;
                        return getTimes(duration);
                    }, searchable: true, title: 'Time'
                },
            ],
            createdRow: function (row, data, dataIndex) {
                if (data.status == 'done') {
                    $(row).addClass('warning');
                } else if (data.status == 'open') {
                    $(row).addClass('light');
                }

                // else if (data.status == 'close') {
                //    $(row).addClass('hidden');
                // }
                if (data.status != 'close' && data.status != 'done') {
                    var duration = new Date(data.createDate).getTime() + getTimeFromString(data.time) - new Date().getTime();
                    let alert = new Date(data.createDate).getTime() + getTimeFromString(data.alert) - new Date().getTime();
                    let urgent = new Date(data.createDate).getTime() + getTimeFromString(data.urgent) - new Date().getTime();

                    if (duration <= 0) {
                        $(row).addClass('info');
                    } else if (alert <= 0) {
                        $(row).addClass('orange');
                    } else if (urgent <= 0) {
                        $(row).addClass('success');
                    }
                }

                $(row).attr('title', 'Click to go to task with id is ' + data.id);
                $(row).mousedown(function (e) {
                    window.open(host2 + '#ajax/task?id=' + data.id, e.which == 2 ? '_blank' : '_self');
                });
            },
            order: [[0, 'desc']],
            initComplete: function(){
                $('#task_select_status').trigger('change');
            }
        });
        $("#table_task thead th input").on('keyup change', function () {

            tb_data
                .column($(this).parent().index() + ':visible')
                .search(this.value)
                .draw();

        });
    },
    loadTable: function (_page, _pagelength) {
        var _mydata = {
            token: localStorage.getItemValue('token'),
            jwt: localStorage.getItemValue('jwt'),
            private_key: localStorage.getItemValue('userID'),
            assign_id: localStorage.getItemValue('userID')
        };

        var _data = $("#form_search").serializeArray()
        _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
                _mydata[elem.name] = elem.value;
            }
        });

        if (_mydata.search_all && _mydata.search_all != '') {
            _mydata.taskName = _mydata.search_all;
        } else {
        }
        delete _mydata.search_all;
        $.ajax({
            url: link._task_getNew,
            type: 'POST',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                TaskNew.prototype.displayList(res.list);
            }
        })
    },
}

var _TaskNew = new TaskNew()
_TaskNew.init();