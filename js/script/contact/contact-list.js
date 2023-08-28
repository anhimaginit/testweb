function ContactList() { }
ContactList.pageno = 1;
ContactList.pagelength = 10;
ContactList.prototype.constructor = ContactList;

ContactList.prototype = {
    init: function () {
        loadTable = this.loadTable;
        search = function () {
            ContactList.prototype.loadTable();
        }
        $(function () {
            searchType('contact');
            if ($.cookie('search_all_contact')) {
                $('input[name="search_all"]').val($.cookie('search_all_contact'));
                $('input[name="search_all"]').change();
                search()
                $('#panel_search_all').show();
            }else if(window['search_all_contact']){
                $('input[name="search_all"]').val(window['search_all_contact']);
                $('input[name="search_all"]').change();
                // search();
                delete window['search_all_contact'];
                $('#panel_search_all').show();
            } else {
                $('#table_contact').ready(function () {
                    ContactList.prototype.loadTable();
                });
            }
        });
    },
    displayList: function (list) {
        var tb_data = $('#table_contact').DataTable({
            "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
            buttons: [
                { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Contact List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Contact List - ' + getDateTime(), className: 'btn btn-default' },
                { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Contact List - ' + getDateTime(), className: 'btn btn-default' },
                {
                    extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Contact List - ' + getDateTime(), className: 'btn btn-default',
                    action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                            event.preventDefault();
                            messageForm('You haven\'t permission to download contact list', 'warning', '.message_table:first');
                            return false;
                        } else {
                            $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                    }
                },
                { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Contact List - ' + getDateTime(), className: 'btn btn-default' },
            ],
            data: list,
            destroy: true,
            // pageLength: 10,
            searching: true,
            // paging: true,
            columns: [
                { data: 'ID', title: '#&nbsp;ID' },
                {
                    data: function (data, type, row) {
                        return (data.first_name ? data.first_name + ' ' : '') + (data.last_name ? data.last_name : '');
                    }
                },
                { data: function (data) { return data.primary_email ? data.primary_email : '' }, "searchable": true },
                { data: function (data) { return data.primary_phone ? data.primary_phone : '' }, "searchable": true },
                { data: function (data) { return data.company_name ? data.company_name : '' }, "searchable": true },
                { data: function (data) { return data.primary_city ? data.primary_city : '' }, "searchable": true },
                { data: function (data) { return data.primary_state ? data.primary_state : '' }, "searchable": true },
                { data: function (data) { return data.primary_postal_code ? data.primary_postal_code : '' }, "searchable": true }
            ],
            createdRow: function (row, data, dataIndex) {
                // if(!['Affiliate'].includes(department)){
                $(row).attr('title', 'Click to go to contact with id is ' + data.ID);
                $(row).click(function () {
                    window.open(host2 + '#ajax/contact-form.php?id=' + data.ID, '_self');
                });
                // }
            },
            order: [[1, 'asc']]
        });
        // if((['Affiliate']).includes(department)){
        //     $("#table_contact").prepend('<caption class="alert alert-warning">You cannot edit or view contact detail</caption>')
        // }
        $("#table_contact thead th input").on('keyup change', function () {

            tb_data
                .column($(this).parent().index() + ':visible')
                .search(this.value)
                .draw();

        });
    },
    loadTable: function (_page, _pagelength) {
        
        var _mydata = $.extend({}, template_data);
        var _data = $("#form_search").serializeArray()
        _data.forEach(function (elem) {
            _mydata[elem.name] = elem.value;
        });

        $.ajax({
            url: link._contactFilterList,
            type: 'POST',
            data: _mydata,
            dataType: 'json',
            success: function (res) {
                ContactList.prototype.displayList(res.list);
            }
        })
    },
}

var _contactList = new ContactList()
_contactList.init();
