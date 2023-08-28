function CompanyList() { }
CompanyList.pageno = 1;
CompanyList.pagelength = 10;
CompanyList.prototype.constructor = CompanyList;

CompanyList.prototype = {
   init: function () {
      loadTable = this.loadTable;
      selectPage = function (page) {
         CompanyList.prototype.loadTable(page, $('select[name="page_size"]').val());
      }
      search = function () {
         CompanyList.prototype.loadTable();
      }
      $(function () {
         searchType('company');
         if ($.cookie('search_all_company')) {
            $('input[name="search_all"]').val($.cookie('search_all_company'));
            // $('input[name="search_all"]').change();
            search()
            $('#panel_search_all').show();
         }else if(window['search_all_company']){
            $('input[name="search_all"]').val(window['search_all_company']);
            $('input[name="search_all"]').change();
            // search();
            delete window['search_all_company'];
            $('#panel_search_all').show();
        } else {
            $('#table_company').ready(function () {
               CompanyList.prototype.loadTable();
            });
         }
      });
   },
   loadTable: function () {
      var _mydata = $.extend({}, template_data);

      var _data = $("#form_search").serializeArray()
      _data.forEach(function (elem) {
         if(elem.name!='' && elem.value!=''){
            _mydata[elem.name] = elem.value;
         }
      });
      $.ajax({
         url: link._companyList,
         type: 'POST',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            var _data = res.list;
            var tb_data = $('#table_company').DataTable({
               "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               buttons: [
                  { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Company List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Company List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Company List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Company List - ' + getDateTime(), className: 'btn btn-default',
                     action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                           event.preventDefault();
                           messageForm('You haven\'t permission to download company list', 'warning', '.message_table:first');
                           return false;
                        } else {
                           $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                     }
                  },
                  { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Company List - ' + getDateTime(), className: 'btn btn-default' },
               ],
               data: _data,
               destroy: true,
               columns: [
                  { data: 'ID', searchable: true },
                  { data: 'name', "searchable": true },
                  { data: 'address1', "searchable": true },
                  { data: 'phone', "searchable": true },
                  { data: 'city', "searchable": true },
                  { data: 'email', "searchable": true },
                  {
                     mRender: function (data, type, row) {
                        var elem = '';
                        JSON.parse(row.type).forEach(function (item) {
                           var color = '';
                           switch (item) {
                              case 'Real Estate Broker': {
                                 color = 'bg-color-green';
                                 break;
                              }
                              case 'Mortgage': {
                                 color = 'bg-color-blue';
                                 break;
                              }
                              case 'Bacle': {
                                 color = 'bg-color-orange';
                                 break;
                              }
                              case 'Title': {
                                 color = 'bg-color-purple';
                                 break;
                              }
                              case 'Vendor': {
                                 color = 'label-success';
                                 break;
                              }
                              default: {
                                 color = 'bg-color-red';
                                 break;
                              }

                           }
                           elem += ' <span class="badge ' + color + ' txt-color-white">' + item + '</span>';
                        });
                        return elem;
                     }, "searchable": true
                  }
               ],
               createdRow: function (row, data, dataIndex) {
                  $(row).attr('title', 'Click to go to company with id is ' + data.ID);
                  $(row).click(function () {
                     window.open(host2 + '#ajax/company-form.php?id=' + data.ID, '_self');
                  });
               },
               order: [[1, 'asc']]
            });

            $("#table_company thead th input").on('keyup change', function () {
               tb_data
                  .column($(this).parent().index() + ':visible')
                  .search(this.value)
                  .draw();

            });
         }
      })
   },
}

var _companyList = new CompanyList()
_companyList.init();