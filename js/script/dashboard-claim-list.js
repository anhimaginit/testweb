function ClaimDashBoardList() { }
ClaimDashBoardList.pageno = 1;
ClaimDashBoardList.pagelength = 10;
ClaimDashBoardList.prototype.constructor = ClaimDashBoardList;

ClaimDashBoardList.prototype = {
    init: function () {
        loadTable = this.loadTable;

        $('#claim_select_status').select2().on('change', function (e) {
            let data = $(this).val();
            $('#table_claim').DataTable().column(5)
               .search(data.join('|'), true, false)
               .draw();
         });

        loadTable();
    },
    loadTable: function () {
        var _mydata = $.extend({}, template_data);
        _mydata.limitDay = $('.date_length').val();
        let _link = link._dashboardClaimList;
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
            dataType: 'json',

            success: function (res) {
                var tb_data = $('#table_claim').DataTable({
                    "sDom": "t" + "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                    data: res && res.list instanceof Array ? res.list : [],
                    destroy: true,
                    searching: true,
                    serverside: false,
                    columns: [
                        { data: 'ID', "searchable": true, title: 'ID' },
                        { data: 'create_by_name', searchable: true, title: 'Created By', class: 'hidden' },
                        { data: 'contact_name', "searchable": true, title: 'Customer' },
                        { data: 'note', "searchable": true, title: 'Description' },
                        { data: function (data) { return data.claim_asg_name || '' }, searchable: true, title: 'Assigned To' },
                        { data: 'status', "searchable": true, title: 'Status' },
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
                                window.open(host2 + '#ajax/claim-form.php?id=' + data.ID, '_self');
                            }
                        });
                    },
                    initComplete: function(){
                        $('#claim_select_status').val(['Open','In Progress']).trigger('change');
                    }
                });
                // if (['Employee', 'Vendor'].includes(department)) {
                //     $("#table_claim").prepend('<caption class="alert alert-warning">You cannot edit or view the claim detail</caption>');
                // }
                $("#table_claim thead th input").on('keyup change', function () {

                    tb_data
                        .column($(this).parent().index() + ':visible')
                        .search(this.value)
                        .draw();

                });

            }
        })
    }
}

var _claimDashBoardList = new ClaimDashBoardList()
_claimDashBoardList.init();