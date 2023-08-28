function TicketList() { }

TicketList.prototype = {
    constructor: TicketList,
    init: function () {
        loadTable = this.loadTable;
        search = loadTable;
        $(function () {
            $('#help_select_status').select2().on('change', function (e) {
                let data = $(this).val();
                $('#table_ticket').DataTable().column(5)
                   .search(data.join('|'), true, false)
                   .draw();
             });
            if (window.location.href.indexOf('ticket-list') > 0) {
                // searchType('Ticket');
                // if ($.cookie('search_all_ticket')) {
                //     $('input[name="search_all"]').val($.cookie('search_all_ticket'));
                //     // $('input[name="search_all"]').change();
                //     search();
                //     $('#panel_search_all').show();
                // } else {
                    $('#table_ticket').ready(function () {
                        TicketList.prototype.loadTable();
                    });
                // }
            }
        });
    },
    displayList: function (list) {
        var tb_data = $('#table_ticket').DataTable({
            "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Ticket List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Ticket List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Ticket List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Ticket List - ' + getDateTime(), className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download ticket list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Ticket List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,
            destroy: true,
            searching: true,
            columns: [
                { data: 'create_date', "searchable": true, title: 'Time' },
                { data: 'form', searchable: true, title: 'Form', className: 'uppercase-character' },
                { data: 'subject', title: 'Subject' },
                { data: 'created_by_name', title: 'Created By', className: 'uppercase-character' },
                { data: 'assign_to_name', title: 'Assigned To', className: 'uppercase-character' },
                { data: function(data){return data.status? data.status: '&nbsp;'}, title: 'Status', className: 'uppercase-character' },
                { data: 'problem', title: 'Problem', className: 'col-xs-4' }
            ],
            order: [[0, 'desc']],
            initComplete: function () {
                $('#table_ticket thead tr').clone().appendTo('#table_ticket thead');
                $('#table_ticket thead tr:eq(1) th').each(function (i) {
                    var title = $(this).text();
                    $(this).removeAttr('class tabindex area-controls rowspan colspan area-label');
                    $(this).addClass('hasinput');
                    $(this).html('<input type="text" class="form-control" placeholder="Search ' + title + '" />');

                    $('input', this).on('keyup change', function () {
                        if (tb_data.column(i).search() !== this.value) {
                            tb_data
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    });
                });
                $('#help_select_status').trigger('change');
            },
            createdRow: function (row, data, dataIndex) {
                if (data.status == 'done') {
                    $(row).addClass('warning');
                } else  if (data.status == 'open') {
                    $(row).addClass('light');
                } else  if (data.status == 'inprocess') {
                    $(row).addClass('info');
                }
                else  if (data.status == 'close') {
                    $(row).addClass('danger');
                }

                $(row).attr('title', 'Click to go to ticket with id is ' + data.id);
                $(row).mousedown(function (e) {
                    if (e.target.toString().startsWith('http')) {
                        window.open(e.target.toString(), '_self');
                        e.preventDefault();
                    } else {
                        window.open(host2 + '#ajax/help-desk-edit.php?id=' + data.id, e.which == 2 ? '_blank' : '_self');
                    }
                });
            },
        });
        $("#table_ticket thead th input").on('keyup change', function () {

            tb_data
                .column($(this).parent().index() + ':visible')
                .search(this.value)
                .draw();

        });
    },
    loadTable: function () {
        var _mydata = $.extend({}, template_data);
        var _data = $("#form_search").serializeArray()
        _data.forEach(function (elem) {
           if(elem.name!='' && elem.value!=''){
              _mydata[elem.name] = elem.value;
           }
        });
        $.ajax({
            url: link._heldDeskList,
            type: 'POST',
            data: _mydata,
            dataType: 'json',
            success: function (_data) {
                TicketList.prototype.displayList(_data.list);
            }
        })
    }
}

new TicketList().init();