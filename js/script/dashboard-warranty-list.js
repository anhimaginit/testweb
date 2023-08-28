function WarrantyDashBoardList() { }
WarrantyDashBoardList.pageno = 1;
WarrantyDashBoardList.pagelength = 10;
WarrantyDashBoardList.prototype = {
   init: function () {
      WarrantyDashBoardList.prototype.loadTable(0, 100);
   },

   loadTable: function (_page, _pagelength) {
      var _mydata = $.extend({}, template_data);
      _mydata.limitDay = Number($('.date_length').val());
      var _link = link._dashBoardWanrantyList;
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
               var table = $('#table_warranty').DataTable({
                  sDom: 't' +
                     "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
                  data: _data.list,
                  destroy: true,
                  paging: true,
                  columns: [
                     {
                        data: function (data) {
                           return '<a href="./#ajax/warranty-form.php?id=' + data.ID + '" target="_self">' + data.ID + '</a>';
                        }, "searchable": true
                     },
                     {
                        data: function (data) {
                           var orders = data.warranty_order_id.split(',');
                           var _htm = [];
                           orders.forEach(function (item) {
                              _htm.push('<a href="./#ajax/order-form.php?id=' + item + '" target="_blank">' + item + '</a>');
                           });
                           return _htm.join(', ');

                        }, "searchable": true
                     },
                     { data: 'buyer', "searchable": true },
                     { data: 'salesman', "searchable": true },
                     { data: 'warranty_end_date', "searchable": true },
                     { data: 'warranty_start_date', "searchable": true },
                     { data: 'warranty_address1', "searchable": true }
                  ],
                   order: [[0, 'desc']],
                  createdRow: function (row, data, dataIndex) {
                     // if (window.dashboard_access.includes('WarrantyForm')) {
                        $(row).attr('title', 'Click to go to warranty: ' + data.ID);
                        $(row).click(function (e) {
                           window.open(host2 + '#ajax/warranty-form.php?id=' + data.ID, '_self');
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

var _WarrantyDashBoardList = new WarrantyDashBoardList();
_WarrantyDashBoardList.init();