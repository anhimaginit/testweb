function WarrantyList() { }
WarrantyList.prototype.constructor = WarrantyList;

WarrantyList.prototype = {
    init: function () {
        loadTable = this.loadTable;
        search = function () {
            WarrantyList.prototype.loadTable();
        }
        $(function () {
            searchType('warranty');

            if ($.cookie('search_all_warranty')) {
                $('input[name="search_all"]').val($.cookie('search_all_warranty'));
                // $('input[name="search_all"]').change();
                $('#panel_search_all').show();
                WarrantyList.prototype.loadTable()
            }else if (window['search_all_warranty']) {
                $('input[name="search_all"]').val(window['search_all_warranty']);
                $('input[name="search_all"]').change();
                $('#panel_search_all').show();
                delete window['search_all_warranty']
             } else {
                WarrantyList.prototype.loadTable();
            }
        });
    },

    displayList: function (list) {
        var table = $('#table_warranty').DataTable({
            sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Warranty List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Warranty List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Warranty List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Warranty List - ' + getDateTime(), className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download warranty list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Warranty List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,
            destroy: true,
            filter: true,
            paging: true,
            order: [[5, 'desc']],
            columns: [
                {
                    mRender: function (row, type, data) {
                        var _html = [];
                        data.order.forEach(function (od) {
                            _html.push(od.order_title && od.order_title != '' ? od.order_title : od.order_id);
                        });
                        return _html.join(', ');
                    }
                },
                { data: 'buyer', "searchable": true },
                { data: 'warranty_address1', "searchable": true },
                {
                    data: function (data) {
                        var _text = [];
                        data.warranty_type.forEach(function (item) {
                            _text.push(item.prod_name);;
                        })
                        return _text.join(', ');
                    }

                },
                { data: 'salesman', "searchable": true },
                { data: data => data.warranty_creation_date ? data.warranty_creation_date.substring(0, 10) : '', "searchable": true },
            ],
            createdRow: function (row, data, dataIndex) {
                $(row).attr('title', 'Click to go to warranty ' + data.ID);
                $(row).click(function (e) {
                    if (e.target.toString().startsWith('http')) {
                        window.open(e.target.toString(), '_self');
                        e.preventDefault();
                    } else {
                        window.open(host2 + '#ajax/warranty-form.php?id=' + data.ID, '_self');
                    }
                });
            },
        });

        $("#table_warranty thead th input").on('keyup change', function () {

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
        $.ajax({
            url: link._wanrantyFilterList,
            type: 'POST',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                WarrantyList.prototype.displayList(res.list);
            }
        })
    },
}
var _warrantyList = new WarrantyList();
_warrantyList.init();