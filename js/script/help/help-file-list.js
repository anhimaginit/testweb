function HelpFileList() { }

HelpFileList.prototype = {
    init: function () {
        previewFile = this.previewFile;
        removeFile = this.removeFile;
        this.loadTable();
    },
    loadTable: function () {
        $.get('data/help/help-file.json?update=' + Math.random(), function (data) {
            if (data != undefined) {
                let list = [];
                for (var item in data) {
                    list.push(data[item]);
                }
                $('#table_help_file').DataTable({
                    "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    buttons: [
                        { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Help File List - ' + getDateTime(), className: 'btn btn-default' },
                        { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Help File List - ' + getDateTime(), className: 'btn btn-default' },
                        { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Help File List - ' + getDateTime(), className: 'btn btn-default' },
                        {
                            extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Help File List - ' + getDateTime(), className: 'btn btn-default',
                            action: function (e, dt, node, config) {
                                if (!isAdmin()) {
                                    event.preventDefault();
                                    messageForm('You haven\'t permission to download Help File List', 'warning', '.message_table:first');
                                    return false;
                                } else {
                                    $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                                }
                            }
                        },
                        { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Help File List - ' + getDateTime(), className: 'btn btn-default' },
                    ],
                    data: list,
                    destroy: true,
                    searching: true,
                    order: [[2, 'asc']],
                    rowsGroup: [0, 1],
                    columns: [
                        { data: 'category', searching: true, title: 'Category' },
                        { data: function (data) { return data.sub_category != undefined ? data.sub_category : '' }, searching: true, title: 'Sub Category' },
                        { data: 'title', searching: true, title: 'Title' },
                        { data: function (data) { return data.created_date != undefined ? data.created_date : '' }, searching: true, title: 'Created Date' },
                        { data: function (data) { return data.last_update_date != undefined ? data.last_update_date : '' }, searching: true, title: 'Last Update' },
                        { data: function (data) { return data.last_update_by ? '<a href="./#ajax/contact-form.php?id=' + data.last_update_by + '">' + data.last_update_by_name + '</a>' : '' }, title: 'Last Update By' },
                        {
                            mRender: function (data, type, row) {
                                let _html = `
                                <div style="display:flex">
                                    <a class="btn btn-default btn-sm pointer" onclick="previewFile('${row.content}', this)" rel="tooltip" title="Preview help file"><i class="fa fa-info text-primary"></i></a>
                                    <a href="./#ajax/help-file?id=${row.id}" class="btn btn-default btn-sm" rel="tooltip" title="Edit help file"><i class="fa fa-edit text-warning"></i></a>
                                    <a class="btn btn-default btn-sm pointer" onclick="removeFile('${row.id}', this)" rel="tooltip" title="Remove help file"><i class="fa fa-trash text-danger"></i></a>
                                </div>`;
                                return _html;
                            }, title: '', className: 'no-padding'
                        }
                    ],
                    initComplete: function () {
                        $('[rel=tooltip]').tooltip();
                    }
                })
            } else {
                $('#table_help_file').empty();
            }
        });
    },
    previewFile: function (link, elem) {
        if (link) {
            var filename = host2 + link;
            $.get(filename, function (res) {
                let table = $('#table_help_file').DataTable();
                let data = table.row($(elem).parents('tr')).data();
                let title = `<legend class="help-file-title">${data.title}</legend>`;

                $('#preView').find('.modal-content').html(title + res);
                $('#preView').modal('show');
            })
        }
    },
    removeFile: function (id, elem) {
        if (id) {
            $.get(host2 + 'php/action-remove-help-file.php', { id: id }, function (res) {
                res = JSON.parse(res);
                if (res.success) {
                    messageForm('The help file is deleted', true, '.message_table');
                    let table = $('#table_help_file').DataTable();
                    table.row($(elem).parents('tr')).remove().draw();
                } else {
                    messageForm(res.error, false, '.message_table');
                }
            })
        }
    }
}

new HelpFileList().init();