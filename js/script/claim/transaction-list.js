function ClaimTransactionList() { }
ClaimTransactionList.pageno = 1;
ClaimTransactionList.pagelength = 10;
ClaimTransactionList.prototype.constructor = ClaimTransactionList;

ClaimTransactionList.prototype = {
   init: function () {
      loadTable = this.loadTable;
      selectPage = function (page) {
         ClaimTransactionList.prototype.loadTable(page, $('select[name="page_size"]').val());
      }
      search = function () {
         ClaimTransactionList.prototype.loadTable();
      }
      $(function () {
         searchType('claim');
         if ($.cookie('search_all_contact')) {
            $('input[name="search_all"]').val($.cookie('search_all_contact'));
            $('input[name="search_all"]').change();
            $('#panel_search_all').show();
         } else {
            $('#table_contact').ready(function () {
               ClaimTransactionList.prototype.loadTable();
            });
         }
      });
   },
   loadTable: function (_page, _pagelength) {
      var _mydata = $.extend({}, template_data);

      var _data = $("#form_search").serializeArray()
      _data.forEach(function (elem) {
         if(elem.name!='' && elem.value!=''){
            _mydata[elem.name] = elem.value;
         }
      });

      $.ajax({
         url: link._claimTransactionFilterList,
         type: 'POST',
         data: _mydata,
         success: function (res) {
            var _data = JSON.parse(res);
            var final_data = [];
            _data.list.forEach(function (elem) {
               return elem.transaction.forEach(function (item) {
                  if (item.person == localStorage.getItemValue('userID')) {
                     var tmp = [];
                     tmp.push(elem.ID);
                     tmp.push('<a href="./#ajax/contact-form.php?id=' + item.person + '" target="_blank">' + elem.person_name + '</a>');
                     tmp.push(item.name);
                     tmp.push(numeral(item.original).format('$ 0,0[.]00'));
                     tmp.push(numeral(item.current).format('$ 0,0[.]00'));
                     tmp.push(numeral(item.available).format('$ 0,0[.]00'));
                     tmp.push(numeral(item.claim).format('$ 0,0[.]00'));
                     tmp.push(item.datetime);
                     final_data.push(tmp);
                  };
               });;
            });

            var tb_data = $('#table_claim_transaction').DataTable({
               sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               buttons: [
                  { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Claim Limit List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Claim Limit List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Claim Limit List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Claim Limit List - ' + getDateTime(), className: 'btn btn-default',
                     action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                           event.preventDefault();
                           messageForm('You haven\'t permission to download transaction list', 'warning', '.message_table:first');
                           return false;
                        } else {
                           $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                     }
                  },
                  { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Claim Limit List - ' + getDateTime(), className: 'btn btn-default' },
               ],
               data: final_data,
               destroy: true,
               search: false,
               "order": [[0, "asc"], [1, "asc"]],
               columns: [
                  { 'class': 'text-center', "searchable": true },
                  { "searchable": true },
                  { "searchable": true },
                  { 'class': 'text-right', "searchable": true },
                  { 'class': 'text-right', "searchable": true },
                  { 'class': 'text-right', "searchable": false },
                  { 'class': 'text-right', "searchable": true },
                  { "searchable": false },
               ],
               createdRow: function (row, data, dataIndex) {
                  $(row).attr('title', 'Click to go to transaction with id is ' + data[0]);
                  $(row).click(function (e) {
                     if (e.target.toString().startsWith('http')) {
                        window.open(e.target.toString(), '_blank');
                        e.preventDefault();
                     } else {
                        window.open(host2 + '#ajax/claim-form.transaction.php?id=' + data[0], '_blank');
                     }
                  });
               },
               'rowsGroup': [0, 1],
            });
            $("#table_claim_transaction thead th input").on('keyup change', function () {
               tb_data
                  .column($(this).parent().index() + ':visible')
                  .search(this.value)
                  .draw();

            });
         }
      })
   },
}

var _claimTransList = new ClaimTransactionList()
_claimTransList.init();