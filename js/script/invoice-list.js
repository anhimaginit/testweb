function InvoiceList() { }

InvoiceList.prototype = {
   init: function () {
      selectPage = function (page) {
         InvoiceList.prototype.loadTable(page, $('select[name="page_size"]').val());
      }
      loadTable = this.loadTable;
      search = this.loadTable;
      $('input[name="search_all"]').bind('change', function () {
         InvoiceList.prototype.loadTable();
      });
      searchType('invoice');

      if ($.cookie('search_all_invoice')) {
         $('input[name="search_all"]').val($.cookie('search_all_invoice'));
         $('input[name="search_all"]').change();
         $('#panel_search_all').show();

      } else if (window['search_all_invoice']) {
         $('input[name="search_all"]').val(window['search_all_invoice']);
         $('input[name="search_all"]').change();
         $('#panel_search_all').show();
         delete window['search_all_invoice']
      } else {
         InvoiceList.prototype.loadTable();
      }
   },

   displayList: function (list) {
      var table = $('#table_invoice').DataTable({
         sDom: "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
         buttons: [
            { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Invoice List - ' + getDateTime(), className: 'btn btn-default' },
            { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Invoice List - ' + getDateTime(), className: 'btn btn-default' },
            { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Invoice List - ' + getDateTime(), className: 'btn btn-default' },
            {
               extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Invoice List - ' + getDateTime(), className: 'btn btn-default',
               action: function (e, dt, node, config) {
                  if (!isAdmin()) {
                     event.preventDefault();
                     messageForm('You haven\'t permission to download invoice list', 'warning', '.message_table:first');
                     return false;
                  } else {
                     $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                  }
               }
            },
            { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Invoice List - ' + getDateTime(), className: 'btn btn-default' },
         ],
         data: list,
         destroy: true,
         filter: true,
         columns: [
            { data: 'invoiceid', "searchable": true },
            { data: 'customer_name', searchable: true },
            { data: 'sale_name', searchable: true },
            {
               mRender: function (data, type, row) {
                  return '<a href="./#ajax/order-form.php?id=' + row.order_id + '" target="_blank">' + row.order_id + '</a>';
               }
            },
            { data: 'createTime', "searchable": true },
            {
               data: function (data, type, row) {
                  return numeral(data.total).format('$ 0,0.00');
               }, "searchable": true, className: 'text-right'
            },
            {
               data: function (data, type, row) {
                  return numeral(data.payment).format('$ 0,0.00');
               }, "searchable": true, className: 'text-right'
            },
         ],
         order: [[3, 'desc']],
         createdRow: function (row, data, dataIndex) {
            $(row).addClass('row_' + data.order_id);
            if (parseFloat(data.balance) <= 0) {
               $(row).addClass('success');
            }
            $(row).attr('title', 'Click to go to invoice with id is ' + data.ID);
            $(row).click(function (e) {
               if (e.target.toString().startsWith('http')) {
                  window.open(e.target.toString(), '_blank');
                  e.preventDefault();
               } else {
                  window.open(host2 + '#ajax/invoice-form.php?id=' + data.ID, '_self');
               }
            });
         },
      });
      $("#table_invoice thead th input").on('keyup change', function () {
         table
            .column($(this).parent().index() + ':visible')
            .search(this.value)
            .draw();

      });
   },

   loadTable: function () {
      var my_data = $.extend({}, template_data);
      var _data = $("#form_search").serializeArray()
      _data.forEach(function (elem) {
         if (elem.name != '' && elem.value != '') {
            my_data[elem.name] = elem.value;
         }
      });
      $.ajax({
         url: link._invoiceFilterList,
         type: 'post',
         data: my_data,
         dataType: 'json',
         success: function (res) {
            InvoiceList.prototype.displayList(res.list);
         },
      })
   },
}

var _invoice = new InvoiceList();
_invoice.init();