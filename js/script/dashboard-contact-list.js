function ContactDashBoardList() { }
ContactDashBoardList.pageno = 1;
ContactDashBoardList.pagelength = 10;
ContactDashBoardList.prototype.constructor = ContactDashBoardList;

ContactDashBoardList.prototype = {
    init: function () {
        loadTable = this.loadTable;
        loadTable();
    },
    loadTable: function () {
        var _mydata = $.extend({}, template_data);
        _mydata.limitDay = $('.date_length').val();
        var _link = link._dashboardContactList;
        if (_mydata.limitDay == 'custom') {
            delete _mydata.limitDay;
            _mydata.start_date = $('input[name=start_date]').val();
            _mydata.end_date = $('input[name=end_date]').val();
        }
        _mydata.login_id = localStorage.getItemValue('userID');

        $.ajax({
            url: _link,
            type: 'POST',
            data: _mydata,
            success: function (res) {
                let department = localStorage.getItemValue('actor');
                var _data = JSON.parse(res);
                var index = 0;
                var tb_data = $('#table_contact').DataTable({
                    sDom: 't' +
                        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    data: _data.list,
                    destroy: true,
                    paging: true,
                    columns: [
                        { data: null },
                        {
                            data: function (data, type, row) {
                                return (data.first_name ? data.first_name + ' ' : '') + (data.last_name ? data.last_name : '');
                            }
                        },
                        { data: 'primary_email', "searchable": true },
                        { data: 'primary_phone', "searchable": true },
                        { data: 'primary_city', "searchable": true },
                        { data: 'primary_state', "searchable": true },
                        { data: 'primary_postal_code', "searchable": true },
                    ],
                    createdRow: function (row, data, dataIndex) {
                        $(row).attr('title', 'Click to go to contact with id is ' + data.ID);
                        $(row).click(function () {
                            window.open(host2 + '#ajax/contact-form.php?id=' + data.ID, '_self');
                        });
                    },
                    order: [[1, 'asc']],
                });
                tb_data.on('order.dt search.dt', function () {
                    tb_data.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                        cell.innerHTML = i + index + 1;
                    });
                }).draw();

                // if (window.dashboard_access.includes('ContactForm')) {

                $('#table_contact tbody tr').on('click focusin', function () {
                    window.open(host2 + '#ajax/contact-form.php?id=' + data.ID, '_self');
                }).on('ready', function () {
                    $(this).attr('title', 'Click to go to contact: ' + (data.first_name ? data.first_name + ' ' : '') + (data.last_name ? data.last_name : ''));
                });
                // }
                $("#table_contact thead th input").on('keyup change', function () {

                    tb_data
                        .column($(this).parent().index() + ':visible')
                        .search(this.value)
                        .draw();

                });
            }
        })
    }
}

var _ContactDashBoardList = new ContactDashBoardList()
_ContactDashBoardList.init();