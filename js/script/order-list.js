function OrderList() { }
OrderList.pageno = 1;
OrderList.pagelength = 10;
OrderList.prototype = {
    init: function () {
        loadTable = this.loadTable;
        searchType('order');
        search = this.loadTable;
        this.getReportListType(function () {
            if ($.cookie('search_all_order')) {
                $('input[name="search_all"]').val($.cookie('search_all_order'));
                search();
                $('#panel_search_all').show();
            }else if(window['search_all_order']){
                $('input[name="search_all"]').val(window['search_all_order']);
                $('input[name="search_all"]').change();
                // search();
                delete window['search_all_order'];
                $('#panel_search_all').show();
            } else {
                OrderList.prototype.loadTable();
            }
        })
    },
    getReportListType: function (callback) {
        $.get('php/getSession.php?data=int_acl&child=acl_rules-ControlListForm-orderlist', function (res) {
            if (res && res != '') {
                window.report_type = res.replace(/"/g, '');
            } else {
                window.report_type = 'login_only';
            }
            if (callback) callback();
        });
    },

    displayList: function (list) {
        var table = $('#table_order').DataTable({
            sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Order List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Order List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Order List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf',
                    text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF',
                    title: 'Order List - ' + getDateTime(),
                    className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download order list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Order List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,
            destroy: true,
            filter: true,
            order: [[8, 'desc']],
            columns: [{
                data: function (data) {
                    return (data.order_title ? data.order_title : 'Warranty Order - ' + data.order_id)
                },
                "searchable": true
            },
            {
                mRender: function (data, type, row) {
                    return (row.b_name ? row.b_name : '<a href="./#ajax/contact-form.php?id=' + row.b_ID + '" target="_blank">' + '<i class="fa fa-chevron-circle-right"></i> View Detail ' + row.b_ID) + '</a>';
                },
                "searchable": true
            },
            {
                mRender: function (data, type, row) {
                    return (row.s_name ? row.s_name : '<a href="./#ajax/contact-form.php?salespersonid=' + row.s_ID + '" target="_blank">' + '<i class="fa fa-chevron-circle-right"></i> View Detail ' + row.b_ID) + '</a>';
                },
                "searchable": true
            },
            {
                data: function (data, type, row) {
                    return numeral(data.total).format('$ 0,0[.]00');
                },
                "searchable": true,
                className: 'text-right'
            },
            {
                data: function (data, type, row) {
                    if (data.payment == 0) {
                        return '<a href="./#ajax/invoice-form.php?c=' + data.b_ID + '&cn=' + data.b_name + '&o=' + data.order_id + '&s=' + data.SID + '&sn=' + data.s_name + '" title="make invoice">' + numeral(data.payment).format('$ 0,0[.]00') + '</a>'
                    } else {
                        return numeral(data.payment).format('$ 0,0[.]00');
                    }
                },
                "searchable": true,
                className: 'text-right'
            },
            {
                data: function (data, type, row) {
                    return numeral(data.balance).format('$ 0,0[.]00');
                },
                "searchable": true,
                className: 'text-right'
            },
            {
                mRender: function (data, type, row) {
                    if (row['warranty'] != 0 && row['warranty'] != '' && row['warranty'] != '0') {
                        return '<a href="./#ajax/warranty-form.php?id=' + row["warranty"] + '" class="text-success" title="Go to warranty">Go to warranty <i class="fa fa-external-link text-success"></i><?a>';
                    } else {
                        return '';
                    }
                }
            },
            { data: 'invoiceDate', className: 'hidden' },
            { data: 'createTime' }
            ],

            createdRow: function (row, data, dataIndex) {
                if ((data.total == data.payment && data.balance <= 0) || (data.invoiceDate == null && data.payment > 0)) {
                    $(row).addClass('success');
                } else if (data.payment >= 0) {
                    var currentDay = new Date();
                    currentDay.setUTCHours(0, 0, 0, 0);
                    var invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
                    invoiceDate.setUTCHours(0, 0, 0, 0);
                    var time = (invoiceDate.getTime() - currentDay.getTime()) / (86400 * 1e3);
                    if (time < -6 && time > -30) {
                        $(row).addClass('warning');
                        // $(row).css({ 'background-color': '#ffe0b7' }); //orange
                    } else if (time <= -30) {
                        // $(row).addClass('danger');
                        $(row).css({ 'background-color': '#ffaaaa' }); //red
                    }
                }
                $(row).attr('title', 'Click to go to ' + (data.order_title ? data.order_title : 'Warranty Order - ' + data.order_id));
                $(row).click(function (e) {
                    if (e.target.toString().startsWith('http')) {
                        window.open(e.target.toString(), '_self');
                        e.preventDefault();
                    } else {
                        window.open(host2 + '#ajax/order-form.php?id=' + data.order_id, '_self');
                    }
                });
            },

        });
        $("#table_order thead th input").on('keyup change', function () {
            table
                .column($(this).parent().index() + ':visible')
                .search(this.value)
                .draw();

        });
    },

    loadTable: function () {
        var _mydata = $.extend({}, template_data);
        var _data = $("#form_search").serializeArray()
        _data.forEach(function (elem) {
            if (elem.name != '' && elem.value != '') {
                _mydata[elem.name] = elem.value;
            }
        });
        _mydata.personal_filter = window.report_type;
        $.ajax({
            url: link._orderFilterList,
            type: 'post',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                OrderList.prototype.displayList(res.list);
            },
        })
    },
}

var _OrderList = new OrderList();
_OrderList.init();