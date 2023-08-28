function DiscountList() { }

DiscountList.prototype = {
    init: function () {
        this.loadTable();
    },
    loadTable: function () {
        $.ajax({
            url: link._discountListAct,
            type: 'post',
            data: { token: localStorage.getItemValue('token') },
            dataType: 'json',
            success: function (res) {
                var table = $('#table_discount').DataTable({
                    sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    buttons: [
                        { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Discount List - ' + getDateTime(), className: 'btn btn-default' },
                        { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Discount List - ' + getDateTime(), className: 'btn btn-default' },
                        { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Discount List - ' + getDateTime(), className: 'btn btn-default' },
                        {
                            extend: 'pdf',
                            text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF',
                            title: 'Discount List - ' + getDateTime(),
                            className: 'btn btn-default',
                            action: function (e, dt, node, config) {
                                if (!isAdmin()) {
                                    event.preventDefault();
                                    messageForm('You haven\'t permission to download discount list', 'warning', '.message_table:first');
                                    return false;
                                } else {
                                    $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                                }
                            }
                        },
                        { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Discount List - ' + getDateTime(), className: 'btn btn-default' },
                    ],
                    data: res.list,
                    destroy: true,
                    filter: true,
                    columns: [
                        { data: 'id', title: 'ID' },
                        {data : 'discount_name', title : 'Name'},
                        { data: function (data) { return data.apply_to.type == '1' ? 'Order total' : data.apply_to.type == '2' ? 'Product' : 'Add on' }, title: 'Type' },
                        { data: 'start_date', title: 'Start&nbsp;Date' },
                        { data: function (data) { return (data.nerver_expired == '1' ? 'Unlimit' : data.stop_date) }, title: 'Expired' },
                        { data: 'discount_code', title: 'Code' },
                        {
                            data: function (data) {
                                return data.apply_to.value.discount_type.replace('%', ' ') + data.apply_to.value.discount + data.apply_to.value.discount_type.replace('$', ' ');
                            },
                            title: 'Value',
                            className: 'text-right'
                        },
                        {
                            data: function (data) {
                                if (data.apply_to.type == '1') {
                                    return '';
                                } else {
                                    var _html = [];
                                    data.apply_to.products.forEach(function (item) {
                                        _html.push('<label class="label label-primary" style="display:inline-block">' + item.prod_name + '</label>');;
                                    });
                                    return _html.join(', ');
                                }
                            },
                            title: 'Products'
                        }
                    ],

                    createdRow: function (row, data, dataIndex) {
                        $(row).click(function (e) {
                            window.open(host2 + '#ajax/discount-form.php?id=' + data.id, '_self');
                        });
                    },

                });
            }
        })
    },
}

new DiscountList().init();