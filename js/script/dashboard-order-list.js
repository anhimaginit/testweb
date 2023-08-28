function OrderDashBoardList() { }
OrderDashBoardList.pageno = 1;
OrderDashBoardList.pagelength = 10;
OrderDashBoardList.prototype = {
    init: function () {
        this.loadTable();
    },

    loadTable: function () {
        var _mydata = $.extend({}, template_data);
        _mydata.limitDay = $('.date_length').val();
        if (_mydata.limitDay == 'custom') {
            delete _mydata.limitDay;
            _mydata.start_date = $('input[name=start_date]').val();
            _mydata.end_date = $('input[name=end_date]').val();
        }
        _mydata.login_id = localStorage.getItemValue('userID');

        $.ajax({
            url: link._dashboardOrderList,
            type: 'post',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                var table = $('#table_order').DataTable({
                    sDom: 't' +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    data: res.list,
                    destroy: true,
                    paging: true,
                    columns: [
                        { data: 'order_id', "searchable": true },
                        {
                            data: function (data) {
                                if (data.b_ID && data.b_name) {
                                    return '<a href="./#ajax/contact-form.php?id=' + data.b_ID + '">' + data.b_name + '</a>';
                                } else {
                                    return '';
                                }
                            },
                            "searchable": true
                        },
                        {
                            data: function (data) {
                                if (data.s_ID && data.s_name) {
                                    return '<a href="./#ajax/contact-form.php?id=' + data.s_ID + '">' + data.s_name + '</a>';
                                } else {
                                    return '';
                                }
                            },
                            "searchable": true
                        },
                        {
                            data: function (data, type, row) {
                                return numeral(data.total).format('$ 0,0.00');
                            },
                            "searchable": true,
                            className: 'text-right'
                        },
                        {
                            data: function (data, type, row) {
                                return numeral(data.payment).format('$ 0,0.00');
                            },
                            "searchable": true,
                            className: 'text-right'
                        },
                        {
                            data: function (data, type, row) {
                                return numeral(data.balance).format('$ 0,0.00');
                            },
                            "searchable": true,
                            className: 'text-right'
                        }
                    ],
                    order: [[0, 'desc']],

                    createdRow: function (row, data, dataIndex) {
                        // if (window.dashboard_access.includes('OrderForm')) {
                            $(row).attr('title', 'Click to go to order: ' + data.order_id);
                            $(row).click(function (e) {
                                window.open(host2 + '#ajax/order-form.php?id=' + data.order_id, '_self');
                            });
                        // }

                        if ((data.total == data.payment && data.balance == 0) || (data.invoiceDate == null && data.payment > 0)) {
                            $(row).addClass('success');
                        } else if (data.payment == 0) {
                            var currentDay = new Date();
                            currentDay.setUTCHours(0, 0, 0, 0);
                            var invoiceDate = data.invoiceDate ? new Date(data.invoiceDate) : new Date();
                            invoiceDate.setUTCHours(0, 0, 0, 0);
                            var time = (invoiceDate.getTime() - currentDay.getTime()) / (86400 * 1000);
                            if (time < -6 && time > -30) {
                                $(row).addClass('warning');
                                // $(row).css({ 'background-color': '#ffe0b7' }); //orange
                            } else if (time <= -30) {
                                $(row).addClass('danger');
                                // $(row).css({ 'background-color': '#ffaaaa' }); //red
                            }
                        }
                        // // open
                        // if (data.balance == data.total) {
                        //    $(row).addClass('danger');
                        //    // payment
                        // } else if (data.balance < data.total && data.balance > 0) {
                        //    $(row).addClass('warning');
                        //    // paid for
                        // } else if (data.balance == 0) {
                        //    $(row).addClass('success');
                        // }
                    }

                });
                $("#table_order thead th input").on('keyup change', function () {
                    table
                        .column($(this).parent().index() + ':visible')
                        .search(this.value)
                        .draw();
                });
            }
        })
    }
}

var _OrderDashBoardList = new OrderDashBoardList();
_OrderDashBoardList.init();