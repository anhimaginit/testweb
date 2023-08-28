function InvoiceDashBoardList() { }
InvoiceDashBoardList.pageno = 1;
InvoiceDashBoardList.pagelength = 10;
InvoiceDashBoardList.prototype = {
   init: function () {
      this.loadTable();
   },
   loadTable: function () {
      var _mydata = $.extend({}, template_data);
      _mydata.limitDay = $('.date_length').val();
      var _link = link._dashboardInvoiceList;
      if (_mydata.limitDay == 'custom') {
         delete _mydata.limitDay;
         _mydata.start_date = $('input[name=start_date]').val();
         _mydata.end_date = $('input[name=end_date]').val();
      }
      _mydata.login_id = localStorage.getItemValue('userID');
      $.ajax({
         url: _link,
         type: 'post',
         data: _mydata,
         success: function (res) {
            if (res.trim().startsWith('{')) {
               var _data = JSON.parse(res);
               var table = $('#table_invoice').DataTable({
                  sDom: 't' +
                     "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                  data: _data.list,
                  destroy: true,
                  paging: true,
                  columns: [
                     { data: 'invoiceid', "searchable": true },
                     { data: 'customer_name', "searchable": true },
                     { data: 'sale_name', "searchable": true },
                     {
                        data: function (data) {
                           return '<a href="./#ajax/order-form.php?id=' + data.order_id + '" target="_blank">' + data.order_id + '</a>';
                        }, "searchable": true
                     },
                     { data: 'createTime', "searchable": true },
                     {
                        data: function (data, type, row) {
                           return numeral(data.total).format('$ 0,0.00')
                        }, "searchable": true, className: 'text-right'
                     },
                     {
                        data: function (data, type, row) {
                           return numeral(data.payment).format('$ 0,0.00')
                        }, "searchable": true, className: 'text-right'
                     },
                     {
                        data: function (data, type, row) {
                           return numeral(data.balance).format('$ 0,0.00')
                        }, "searchable": true, className: 'text-right'
                     }
                  ],
                   order: [[3, 'desc']],
                  createdRow: function (row, data, dataIndex) {
                     // if (window.dashboard_access.includes('InvoiceForm')) {
                        $(row).attr('title', 'Click to go to invoice: ' + data.invoiceid);
                        $(row).click(function (e) {
                           window.open(host2 + '#ajax/invoice-form.php?id=' + data.ID, '_self');
                        });
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
         },
      })
   }
}

var _InvoiceListDashBoardList = new InvoiceDashBoardList();
_InvoiceListDashBoardList.init();