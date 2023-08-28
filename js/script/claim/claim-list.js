function ClaimList() { }
ClaimList.pageno = 1;
ClaimList.pagelength = 10;
ClaimList.prototype.constructor = ClaimList;

ClaimList.prototype = {
    init: function () {
        loadTable = this.loadTable;
        search = function () {
            ClaimList.prototype.loadTable();
        }
        $(function () {
            $('#claim_select_status').select2().on('change', function (e) {
                let data = $(this).val();
                $('#table_claim').DataTable().column(5)
                   .search(data.join('|'), true, false)
                   .draw();
             });
            if (window.location.href.indexOf('claim-list') > 0) {
                searchType('claim');
                if ($.cookie('search_all_claim')) {
                    $('input[name="search_all"]').val($.cookie('search_all_claim'));
                    // $('input[name="search_all"]').change();
                    search();
                    $('#panel_search_all').show();
                } else {
                    $('#table_claim').ready(function () {
                        ClaimList.prototype.loadTable();
                    });
                }
            }
        });
    },
    displayList: function (list) {
        if ($.fn.DataTable.isDataTable('#table_claim')) {
            $('#table_claim').DataTable().clear();
            $('#table_claim').DataTable().destroy();
        }
        $('#table_claim').empty();
        var tb_data = $('#table_claim').DataTable({
            "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Claim List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Claim List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Claim List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Claim List - ' + getDateTime(), className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download claim list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Claim List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,

            destroy: true,
            searching: true,
            columns: [
                { data: 'ID', "searchable": true, title: 'ID' },
                { data: 'create_by_name', searchable: true, title: 'Created By', class: 'hidden' },
                { data: 'contact_name', "searchable": true, title: 'Customer' },
                { data: 'note', "searchable": true, title: 'Description' },
                { data: function (data) { return data.claim_asg_name || '' }, searchable: true, title: 'Assigned To' },
                { data: function(data){return data.status ? data.status : '&nbsp;'}, "searchable": true, title: 'Status' },
                {
                    data: function (data) {
                        if (data.service_fee && data.service_fee.products_ordered && data.service_fee.products_ordered.length > 0) {
                            let total_service_fee = 0;
                            data.service_fee.products_ordered.forEach(function (item) {
                                total_service_fee += parseFloat(item.price);
                            });
                            return numeral(total_service_fee).format('$ 0,0.00');
                        } else {
                            return '$ 0';
                        }
                    }, className: 'text-right', title: 'Service Fee'
                },
                { data: function (data) { return (data.paid == '' || data.paid == 'false' || data.paid == false || !data.paid) ? '' : 'Paid' }, "searchable": true, title: 'Paid Out' },
                { data: 'start_date', "searchable": true, title: 'Start Date' },
            ],
            order: [[0, 'desc']],
            createdRow: function (row, data, dataIndex) {
                if (data.status) {
                    switch (data.status.toLowerCase()) {
                        case 'not assign':
                        case 'open':
                            $(row).addClass('white');
                            break;
                        case 'in progress':
                        case 'in process':
                            $(row).addClass('warning');
                            break;
                        case 'approved':
                        case 'assigned':
                            $(row).addClass('success');
                            break;
                        case 'close':
                            $(row).addClass('orange');
                            break;
                        case 'deny':
                        case 'cancel':
                            $(row).addClass('red');
                            break;
                        default:
                            $(row).addClass('white');
                            break;
                    }
                }

                // if ((data.paid == '' || data.paid == 'false' || data.paid == false || !data.paid)) {
                //     $(row).addClass('orange');
                // }

                $(row).attr('title', 'Click to go to claim with id is ' + data.ID);
                $(row).click(function (e) {
                    if (e.target.toString().startsWith('http')) {
                        window.open(e.target.toString(), '_self');
                        e.preventDefault();
                    } else {
                        window.open(host2 + '#ajax/claim-form?id=' + data.ID, '_self');
                    }
                });
            },
            initComplete: function () {
                $('#table_claim thead tr').clone().appendTo('#table_claim thead');
                $('#table_claim thead tr:eq(1) th').each(function (i) {
                    var title = $(this).text();
                    $(this).removeAttr('class tabindex area-controls rowspan colspan area-label');
                    $(this).addClass('hasinput');

                    if(title == 'Created By') {
                        $(this).addClass('hidden');
                    }

                    $(this).html('<input type="text" class="form-control" placeholder="Search ' + title + '" />');
                    $('input', this).on('keyup change', function () {
                        if ($('#table_claim').DataTable().column(i).search() !== this.value) {
                            $('#table_claim').DataTable()
                                .column(i)
                                .search(this.value)
                                .draw();
                        }
                    });
                });

                $('#claim_select_status').val(['Open','In Progress']).trigger('change');
            }
        });
        $("#table_claim thead th input").on('keyup change', function () {

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
        var cookieClaim = JSON.parse(localStorage.getItemValue('claimIDs'));
        _mydata.claimIDs = cookieClaim;
        $.ajax({
            url: link._claimFilterList,
            type: 'POST',
            data: _mydata,
            dataType: 'json',
            success: function (_data) {
                ClaimList.prototype.displayList(_data.list);
            }
        })
    },
}

var _claimList = new ClaimList()
_claimList.init();