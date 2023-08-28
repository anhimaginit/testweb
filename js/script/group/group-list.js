function GroupList() {
   // this.createDiagram();
}

GroupList.prototype.constructor = GroupList;

var fullDiagram = new DiagramGoJS('hierachy_pane');
var sale_diagram, affiliate_diagram, vendor_diagram, policy_diagram, employee_diagram, customer_diagram;
if (isSystemAdmin()) {
   sale_diagram = new DiagramGoJS('hierachy_pane_sales');
   affiliate_diagram = new DiagramGoJS('hierachy_pane_affiliate');
   vendor_diagram = new DiagramGoJS('hierachy_pane_vendor');
   policy_diagram = new DiagramGoJS('hierachy_pane_policy');
   employee_diagram = new DiagramGoJS('hierachy_pane_employee');
   customer_diagram = new DiagramGoJS('hierachy_pane_customer');
}

GroupList.prototype = {
   init: function () {
      removeGroup = this.removeGroup;
      this.loadTable();
      this.bindEvent();
   },
   loadTable: function () {
      var _mydata = {
         token: localStorage.getItemValue('token'),
         jwt: localStorage.getItemValue('jwt'),
         private_key: localStorage.getItemValue('userID'),
         login_id: localStorage.getItemValue('userID'),
         role: JSON.parse(localStorage.getItemValue('int_acl_short'))
      };

      var _data = $("#claim_form").serializeArray()
      _data.forEach(function (elem) {
         if (elem.name != '' && elem.value != '') {
            _mydata[elem.name] = elem.value;
         }
      });
      _mydata.login_id = localStorage.getItemValue('userID');
      var _self = this;
      $.ajax({
         url: link._groupList,
         type: 'POST',
         data: _mydata,
         dataType: 'json',
         success: function (res) {
            var _data = res.list;
            window.group_list_table = res.list;
            window.tb_data = $('#table_group').DataTable({
               "sDom": "<'dt-toolbar'<'col-sm-12 col-xs-12'B>r>" + "t" +
                  "<'dt-toolbar-footer'<'col-sm-6 col-xs-12'i><'col-xs-12 col-sm-6'p>>",
               buttons: [
                  { extend: 'copy', text: '<i class="fa fa-files-o text-danger"></i> Copy', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'csv', text: '<i class="fa  fa-file-zip-o text-primary"></i> CSV', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  { extend: 'excel', text: '<i class="fa fa-file-excel-o text-success"></i> Excel', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     extend: 'pdf', text: '<i class="fa fa-file-pdf-o" style="color:red"></i> PDF', title: 'Group List - ' + getDateTime(), className: 'btn btn-default',
                     action: function (e, dt, node, config) {
                        if (!isAdmin()) {
                           e.preventDefault();
                           messageForm('You haven\'t permission to download group list', 'warning', '.message_table:first');
                           return false;
                        } else {
                           $.fn.dataTable.ext.buttons.pdfHtml5.action.call(this, e, dt, node, config);
                        }
                     }
                  },
                  { extend: 'print', text: '<i class="fa fa-print"></i> Print', title: 'Group List - ' + getDateTime(), className: 'btn btn-default' },
                  {
                     text: '<i class="fa fa-image"></i> Export Diagram', title: 'Group Diagram' + getDateTime(), className: 'btn btn-default export-hierachy_pane',
                     action: function (e, dt, node, config) {
                        e.preventDefault();
                        fullDiagram.exportToImage();
                     }
                  }
               ],
               data: _data,
               destroy: true,
               columns: [
                  { data: 'ID', searchable: true },
                  { data: 'department', "searchable": true },
                  { data: 'group_name', "searchable": true },
                  { data: 'role', "searchable": true },
                  {
                     data: function (data) {
                        if (data.userName) {
                           var _html = [];
                           data.userName.forEach(function (u) {
                              _html.push('<a href="./#ajax/contact-form.php?id=' + u.ID + '" data-uid="'+u.ID+'" class="userName" target="_blank">' + u.name + '</a>');;
                           })
                           return _html.join(', ');
                        }
                     }, "searchable": true
                  },
                  {
                     data: function (data) {
                        return data.parent_group != '0' ? '<a href="./#ajax/group.php?id=' + data.parent_group + '" target="_self">' + data.parent_gr_name + '</a>' : 'root';
                     }, "searchable": true
                  },
                  {
                     data: function (data) {
                        if (data.parent_id && data.parent_id != '0' && data.parent_id != 0) {
                           var _html = [];
                           data.parent_name.forEach(function (parent) {
                              _html.push('<a href="./#ajax/contact-form.php?id=' + parent.ID + '" data-uid="'+parent.ID+'" class="userName" target="_blank">' + parent.name + '</a>');;
                           })
                           return _html.join(', ');
                        } else {
                           return '';
                        }
                     }, "searchable": true
                  },
                  {
                     mRender: function (data, type, row) {
                        var elem = '<div style="display:flex">';
                        elem += '<a href="./#ajax/group.php?id=' + row.ID + '" class="btn btn-default label"><i class="fa fa-edit text-primary"></i></a> ';

                        elem += '<a href="javascript:" class="btn btn-default label" title="Remove group" onclick="removeGroup(' + row.ID + ', this)"><i class="fa fa-times text-danger"></i></a>';
                        elem += '</div>';
                        return elem;
                     }
                  }
               ],
               order: [[1, 2, 3, 'asc']],
               createdRow: function (row, data, dataIndex) {
                  var color = '';
                  color = data.role == 'Admin' ? 'success' : data.role == 'Manager' ? 'warning' : data.role == 'Leader' ? 'info' : data.role == 'User' ? '' : 'danger';
                  $(row).addClass(color);
               }
            });

            $("#table_group thead th input").on('keyup change', function () {
               window.tb_data
                  .column($(this).parent().index() + ':visible')
                  .search(this.value)
                  .draw();
            });

            $(document).on('mouseenter', '#table_group a', function () {
               let uid = $(this).data('uid');
               $('#table_group [data-uid="' + uid + '"]').css({ 'background': 'black', color: 'white' });
            }).on('mouseleave', '#table_group a', function () {
               let uid = $(this).data('uid');
               $('#table_group [data-uid="' + uid + '"]').css({ 'background': 'unset', color: '#3276b1' });
            });

            _self.draw(res.list);
         }
      });
   },

   bindEvent: function () {
      $('.export_sale').click(function () {
         sale_diagram.exportToImage();
      });
      $('.export_affiliate').click(function () {
         affiliate_diagram.exportToImage();
      });
      $('.export_vendor').click(function () {
         vendor_diagram.exportToImage();
      });
      $('.export_policy').click(function () {
         policy_diagram.exportToImage();
      });
      $('.export_employee').click(function () {
         employee_diagram.exportToImage();
      });
      $('.export_customer').click(function () {
         customer_diagram.exportToImage();
      });
   },

   draw: function (list) {
      fullDiagram.drawDiagram(list);
      if (isSystemAdmin()) {
         sale_diagram.drawDiagram(list, 'Sales');
         affiliate_diagram.drawDiagram(list, 'Affiliate');
         vendor_diagram.drawDiagram(list, 'Vendor');
         policy_diagram.drawDiagram(list, 'PolicyHolder');
         employee_diagram.drawDiagram(list, 'Employee');
         customer_diagram.drawDiagram(list, 'Customer');
      }
   },
   setDataTable: function (list) {
      if (list && window.tb_data) {
         window.tb_data.clear();
         window.tb_data.rows.add(list);
         window.tb_data.draw();
      }
   },

   removeGroup: function (id, elem) {
      var tds = $(elem).closest('tr').find('td');
      var _cf = window.confirm('Deleting group ' + tds.eq(2).text() + ' (' + tds.eq(3).text() + ')' + ' in ' + tds.eq(1).text() + '?');
      var _data = $.extend({}, template_data);
      _data.ID = id;
      if (_cf == true) {
         $.ajax({
            url: link._groupDelete,
            type: 'post',
            data: _data,
            dataType: 'json',
            success: function (res) {
               if (res.ERROR == '' && res.SUCCESS == true) {
                  window.group_list_table.forEach(function (group, index) {
                     if (group.ID == id) {
                        window.group_list_table.splice(index, 1);
                        GroupList.prototype.setDataTable(window.group_list_table);
                        GroupList.prototype.draw(window.group_list_table);
                        return;
                     };
                  });
               } else {
                  messageForm('Error! An error occurred. ' + res.ERROR, 'warning', '.message_table:first');
               }
            },
         });
      }
   },
}

var _groupList = new GroupList();
_groupList.init();